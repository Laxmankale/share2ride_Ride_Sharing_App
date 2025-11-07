package com.share2go.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.share2go.dto.BookingDTO;
import com.share2go.mapper.BookingMapper;
import com.share2go.dto.NotificationDTO;
import com.share2go.service.NotificationService;
import com.share2go.model.Booking;
import com.share2go.model.Ride;
import com.share2go.model.User;
import com.share2go.repository.BookingRepository;
import com.share2go.repository.RideRepository;
import com.share2go.repository.UserRepository;
import com.share2go.service.BookingService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final RideRepository rideRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService;

	public BookingServiceImpl(BookingRepository bookingRepository, RideRepository rideRepository,
			UserRepository userRepository, NotificationService notificationService) {
		super();
		this.bookingRepository = bookingRepository;
		this.rideRepository = rideRepository;
		this.userRepository = userRepository;
		this.notificationService = notificationService;
	}

	@Override
	public BookingDTO createBooking(BookingDTO bookingDTO) {

		Ride ride = rideRepository.findById(bookingDTO.getRideId())
				.orElseThrow(() -> new EntityNotFoundException("Ride not found"));
		User passenger = userRepository.findById(bookingDTO.getPassengerId())
				.orElseThrow(() -> new EntityNotFoundException("Passenger not found"));

		if (bookingDTO.getNumberOfSeats() <= 0) {
			throw new IllegalArgumentException("Requested seats must be greater than zero");
		}

		bookingDTO.setBookingTime(LocalDateTime.now());
		bookingDTO.setStatus("PENDING");

		Booking booking = BookingMapper.toEntity(bookingDTO, ride, passenger);
		Booking savedBooking = bookingRepository.save(booking);

		// Notify the driver about a new booking request
		NotificationDTO n = new NotificationDTO();
		n.setRecipientId(ride.getDriver().getId());
		n.setType("BOOKING_REQUEST");
		n.setMessage("New booking request: " + passenger.getName() + " requested " + bookingDTO.getNumberOfSeats()
				+ " seat(s).");
		n.setRideId(ride.getId());
		n.setBookingId(savedBooking.getId());
		notificationService.createNotification(n);

		return BookingMapper.toDTO(savedBooking);
	}

	@Override
	public BookingDTO getBookingById(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Booking not found"));
		return BookingMapper.toDTO(booking);
	}

	@Override
	public List<BookingDTO> getAllBookings() {
		return bookingRepository.findAll().stream().map(BookingMapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public List<BookingDTO> getBookingsByPassenger(Long passengerId) {
		return bookingRepository.findByPassengerId(passengerId).stream().map(BookingMapper::toDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<BookingDTO> getBookingsByRide(Long rideId) {
		return bookingRepository.findByRideId(rideId).stream().map(BookingMapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public BookingDTO updateBooking(Long id, BookingDTO bookingDTO) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Booking not found"));

		int seatDifference = bookingDTO.getNumberOfSeats() - booking.getNumberOfSeats();
		if (seatDifference > 0 && booking.getRide().getAvailableSeats() < seatDifference) {
			throw new IllegalArgumentException("Not enough available seats to increase booking");
		}

		booking.getRide().setAvailableSeats(booking.getRide().getAvailableSeats() - seatDifference);
		booking.getRide().getAvailableSeats();
		booking.setNumberOfSeats(bookingDTO.getNumberOfSeats());
		booking.setStatus(bookingDTO.getStatus());

		Booking updatedBooking = bookingRepository.save(booking);
		return BookingMapper.toDTO(updatedBooking);
	}

	@Override
	public void cancelBooking(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Booking not found"));

		if ("CONFIRMED".equalsIgnoreCase(booking.getStatus()) || "ACCEPTED".equalsIgnoreCase(booking.getStatus())) {
			Ride ride = booking.getRide();
			ride.setAvailableSeats(ride.getAvailableSeats() + booking.getNumberOfSeats());
			rideRepository.save(ride);
		}

		booking.setStatus("CANCELLED");
		bookingRepository.save(booking);
	}

	@Override
	public BookingDTO acceptBooking(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Booking not found"));

		if ("CONFIRMED".equalsIgnoreCase(booking.getStatus()) || "ACCEPTED".equalsIgnoreCase(booking.getStatus())) {
			return BookingMapper.toDTO(booking);
		}

		Ride ride = booking.getRide();
		int requestedSeats = booking.getNumberOfSeats();
		if (ride.getAvailableSeats() < requestedSeats) {
			throw new IllegalArgumentException("Not enough available seats to accept booking");
		}
		ride.setAvailableSeats(ride.getAvailableSeats() - requestedSeats);
		rideRepository.save(ride);

		booking.setStatus("CONFIRMED");
		Booking saved = bookingRepository.save(booking);
		// Notify passenger of acceptance
		NotificationDTO n = new NotificationDTO();
		n.setRecipientId(booking.getPassenger().getId());
		n.setType("BOOKING_ACCEPTED");
		n.setMessage("Your booking was accepted for " + ride.getOrigin() + " → " + ride.getDestination() + ".");
		n.setRideId(ride.getId());
		n.setBookingId(saved.getId());
		notificationService.createNotification(n);
		return BookingMapper.toDTO(saved);
	}

	@Override
	public BookingDTO rejectBooking(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Booking not found"));

		if ("CONFIRMED".equalsIgnoreCase(booking.getStatus()) || "ACCEPTED".equalsIgnoreCase(booking.getStatus())) {
			throw new IllegalStateException("Cannot reject a confirmed booking. Cancel instead.");
		}

		booking.setStatus("REJECTED");
		Booking saved = bookingRepository.save(booking);
		// Notify passenger of rejection
		NotificationDTO n = new NotificationDTO();
		n.setRecipientId(booking.getPassenger().getId());
		n.setType("BOOKING_REJECTED");
		n.setMessage("Your booking was rejected for " + booking.getRide().getOrigin() + " → "
				+ booking.getRide().getDestination() + ".");
		n.setRideId(booking.getRide().getId());
		n.setBookingId(saved.getId());
		notificationService.createNotification(n);
		return BookingMapper.toDTO(saved);
	}
}
