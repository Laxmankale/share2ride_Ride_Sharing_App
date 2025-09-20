package com.share2go.mapper;

import com.share2go.dto.BookingDTO;
import com.share2go.model.Booking;
import com.share2go.model.Ride;
import com.share2go.model.User;

public class BookingMapper {

	public static BookingDTO toDTO(Booking booking) {
		BookingDTO dto = new BookingDTO();
		dto.setId(booking.getId());
		dto.setRideId(booking.getRide() != null ? booking.getRide().getId() : null);
		dto.setPassengerId(booking.getPassenger() != null ? booking.getPassenger().getId() : null);
		dto.setNumberOfSeats(booking.getNumberOfSeats());
		dto.setStatus(booking.getStatus());
		dto.setBookingTime(booking.getBookingTime());
		return dto;
	}

	public static Booking toEntity(BookingDTO dto, Ride ride, User passenger) {
		Booking booking = new Booking();
		booking.setNumberOfSeats(dto.getNumberOfSeats());
		booking.setStatus(dto.getStatus());
		booking.setBookingTime(dto.getBookingTime());
		booking.setRide(ride);
		booking.setPassenger(passenger);
		return booking;
	}
}
