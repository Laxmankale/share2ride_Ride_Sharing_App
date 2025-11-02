package com.share2go.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.share2go.model.Ride;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByOriginIgnoreCaseAndDestinationIgnoreCase(String origin, String destination);

    List<Ride> findByOriginIgnoreCaseAndDestinationIgnoreCaseAndDepartureTimeAfter(
            String origin, String destination, LocalDateTime departureTime);

    List<Ride> findByDriverId(Long driverId);
}
