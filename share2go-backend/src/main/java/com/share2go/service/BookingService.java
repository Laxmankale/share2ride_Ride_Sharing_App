package com.share2go.service;

import java.util.List;

import com.share2go.dto.BookingDTO;

public interface BookingService {

	BookingDTO createBooking(BookingDTO bookingDTO);

	BookingDTO getBookingById(Long id);

	List<BookingDTO> getAllBookings();

	List<BookingDTO> getBookingsByPassenger(Long passengerId);

	List<BookingDTO> getBookingsByRide(Long rideId);

	BookingDTO updateBooking(Long id, BookingDTO bookingDTO);

	void cancelBooking(Long id);
}
