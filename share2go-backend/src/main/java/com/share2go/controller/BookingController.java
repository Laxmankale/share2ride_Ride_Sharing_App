package com.share2go.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.share2go.dto.BookingDTO;
import com.share2go.service.BookingService;

@RestController
@RequestMapping("/api/bookings")

public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		super();
		this.bookingService = bookingService;
	}

	@PostMapping
	@PreAuthorize("hasRole('PASSENGER')")
	public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
		return ResponseEntity.ok(bookingService.createBooking(bookingDTO));
	}

	@GetMapping("/{id}")
	public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
		return ResponseEntity.ok(bookingService.getBookingById(id));
	}

	@GetMapping
	public ResponseEntity<List<BookingDTO>> getAllBookings() {
		return ResponseEntity.ok(bookingService.getAllBookings());
	}

	@GetMapping("/passenger/{passengerId}")
	public ResponseEntity<List<BookingDTO>> getBookingsByPassenger(@PathVariable Long passengerId) {
		return ResponseEntity.ok(bookingService.getBookingsByPassenger(passengerId));
	}

	@GetMapping("/ride/{rideId}")
	public ResponseEntity<List<BookingDTO>> getBookingsByRide(@PathVariable Long rideId) {
		return ResponseEntity.ok(bookingService.getBookingsByRide(rideId));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('PASSENGER')")
	public ResponseEntity<BookingDTO> updateBooking(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
		return ResponseEntity.ok(bookingService.updateBooking(id, bookingDTO));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
		bookingService.cancelBooking(id);
		return ResponseEntity.ok("Booking cancelled successfully");
	}

	@PutMapping("/{id}/accept")
	public ResponseEntity<BookingDTO> acceptBooking(@PathVariable Long id) {
		return ResponseEntity.ok(bookingService.acceptBooking(id));
	}

	@PutMapping("/{id}/reject")
	public ResponseEntity<BookingDTO> rejectBooking(@PathVariable Long id) {
		return ResponseEntity.ok(bookingService.rejectBooking(id));
	}
}
