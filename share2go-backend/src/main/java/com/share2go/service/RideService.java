package com.share2go.service;

import java.time.LocalDateTime;
import java.util.List;

import com.share2go.dto.RideDTO;

public interface RideService {

	RideDTO createRide(RideDTO rideDTO, Long driverId);

	RideDTO getRideById(Long id);

	List<RideDTO> getAllRides();

	List<RideDTO> searchRides(String origin, String destination, LocalDateTime departureTime);

	RideDTO updateRide(Long id, RideDTO rideDTO);

	void deleteRide(Long id);

	List<RideDTO> getRidesByDriver(Long driverId);
}
