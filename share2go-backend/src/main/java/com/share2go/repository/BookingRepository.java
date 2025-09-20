package com.share2go.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.share2go.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByPassengerId(Long passengerId);

	List<Booking> findByRideId(Long rideId);
}
