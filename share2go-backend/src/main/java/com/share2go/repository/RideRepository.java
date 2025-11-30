package com.share2go.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.share2go.model.Ride;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

        List<Ride> findByOriginIgnoreCaseAndDestinationIgnoreCase(String origin, String destination);

        @Query("SELECT r FROM Ride r WHERE " +
                        "(:origin IS NULL OR :origin = '' OR LOWER(r.origin) LIKE LOWER(CONCAT('%', :origin, '%'))) AND "
                        +
                        "(:destination IS NULL OR :destination = '' OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND "
                        +
                        "r.departureTime >= :departureTime")
        List<Ride> searchRides(@Param("origin") String origin,
                        @Param("destination") String destination,
                        @Param("departureTime") LocalDateTime departureTime);

        List<Ride> findByDriverId(Long driverId);
}
