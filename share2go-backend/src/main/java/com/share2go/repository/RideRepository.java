package com.share2go.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.share2go.model.Ride;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {


    // Find rides by origin and destination (case-insensitive)
    List<Ride> findByOriginIgnoreCaseAndDestinationIgnoreCase(String origin, String destination);

    // Find rides by origin, destination and after given time
    List<Ride> findByOriginIgnoreCaseAndDestinationIgnoreCaseAndDepartureTimeAfter(
            String origin, String destination, LocalDateTime departureTime);

    // Optional: Find rides by driver
    List<Ride> findByDriverId(Long driverId);
}
