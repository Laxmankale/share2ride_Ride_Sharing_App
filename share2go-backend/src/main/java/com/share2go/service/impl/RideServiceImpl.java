package com.share2go.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.share2go.dto.RideDTO;
import com.share2go.mapper.RideMapper;
import com.share2go.model.Ride;
import com.share2go.model.User;
import com.share2go.repository.RideRepository;
import com.share2go.repository.UserRepository;
import com.share2go.service.RideService;

import jakarta.persistence.EntityNotFoundException;

@Service

public class RideServiceImpl implements RideService {

	private final RideRepository rideRepository;
	private final UserRepository userRepository;

	public RideServiceImpl(RideRepository rideRepository, UserRepository userRepository) {
		super();
		this.rideRepository = rideRepository;
		this.userRepository = userRepository;
	}

	@Override
	public RideDTO createRide(RideDTO rideDTO, Long driverId) {
		User driver = userRepository.findById(driverId)
				.orElseThrow(() -> new EntityNotFoundException("Driver not found"));

		Ride ride = RideMapper.toEntity(rideDTO, driver);
		Ride savedRide = rideRepository.save(ride);

		return RideMapper.toDTO(savedRide);
	}

	@Override
	public RideDTO getRideById(Long id) {
		Ride ride = rideRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ride not found"));
		return RideMapper.toDTO(ride);
	}

	@Override
	public List<RideDTO> getAllRides() {
		return rideRepository.findAll().stream().map(RideMapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public List<RideDTO> searchRides(String origin, String destination, LocalDateTime departureTime) {
		return rideRepository
				.findByOriginIgnoreCaseAndDestinationIgnoreCaseAndDepartureTimeAfter(origin, destination, departureTime)
				.stream().map(RideMapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public RideDTO updateRide(Long id, RideDTO rideDTO) {
		Ride ride = rideRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ride not found"));

		ride.setOrigin(rideDTO.getOrigin());
		ride.setDestination(rideDTO.getDestination());
		ride.setDepartureTime(rideDTO.getDepartureTime());
		ride.setAvailableSeats(rideDTO.getAvailableSeats());
		ride.setPricePerSeat(rideDTO.getPricePerSeat());

		Ride updatedRide = rideRepository.save(ride);
		return RideMapper.toDTO(updatedRide);
	}

	@Override
	public void deleteRide(Long id) {
		Ride ride = rideRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ride not found"));
		rideRepository.delete(ride);
	}

	@Override
	public List<RideDTO> getRidesByDriver(Long driverId) {
		return rideRepository.findByDriverId(driverId).stream().map(RideMapper::toDTO).collect(Collectors.toList());
	}
}
