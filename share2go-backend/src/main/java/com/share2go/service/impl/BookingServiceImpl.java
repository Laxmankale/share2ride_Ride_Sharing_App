package com.share2go.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.share2go.dto.BookingDTO;
import com.share2go.mapper.BookingMapper;
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

	public BookingServiceImpl(BookingRepository bookingRepository, RideRepository rideRepository,
			UserRepository userRepository) {
		super();
		this.bookingRepository = bookingRepository;
		this.rideRepository = rideRepository;
		this.userRepository = userRepository;
	}

	@Override
	public BookingDTO createBooking(BookingDTO bookingDTO) {

		Ride ride = rideRepository.findById(bookingDTO.getRideId())
				.orElseThrow(() -> new EntityNotFoundException("Ride not found"));
		User passenger = userRepository.findById(bookingDTO.getPassengerId())
				.orElseThrow(() -> new EntityNotFoundException("Passenger not found"));

		if (ride.getAvailableSeats() < bookingDTO.getNumberOfSeats()) {
			throw new IllegalArgumentException("Not enough available seats");
		}

		ride.setAvailableSeats(ride.getAvailableSeats() - bookingDTO.getNumberOfSeats());
		rideRepository.save(ride);

		bookingDTO.setBookingTime(LocalDateTime.now());
		bookingDTO.setStatus("CONFIRMED");

		Booking booking = BookingMapper.toEntity(bookingDTO, ride, passenger);
		Booking savedBooking = bookingRepository.save(booking);

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

		Ride ride = booking.getRide();
		ride.setAvailableSeats(ride.getAvailableSeats() + booking.getNumberOfSeats());
		rideRepository.save(ride);

		booking.setStatus("CANCELLED");
		bookingRepository.save(booking);
	}
}
