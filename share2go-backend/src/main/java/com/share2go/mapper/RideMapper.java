package com.share2go.mapper;

import java.util.stream.Collectors;

import com.share2go.dto.RideDTO;
import com.share2go.model.Ride;
import com.share2go.model.User;

public class RideMapper {

	public static RideDTO toDTO(Ride ride) {
		RideDTO dto = new RideDTO();
		dto.setId(ride.getId());
		dto.setOrigin(ride.getOrigin());
		dto.setDestination(ride.getDestination());
		dto.setDepartureTime(ride.getDepartureTime());
		dto.setAvailableSeats(ride.getAvailableSeats());
		dto.setPricePerSeat(ride.getPricePerSeat());

		if (ride.getDriver() != null) {
			dto.setDriverId(ride.getDriver().getId());
			dto.setDriverName(ride.getDriver().getName());
		}

		if (ride.getPassengers() != null) {
			dto.setPassengerIds(ride.getPassengers().stream().map(User::getId).collect(Collectors.toList()));
		}

		return dto;
	}

	public static Ride toEntity(RideDTO dto, User driver) {
		Ride ride = new Ride();
		ride.setId(dto.getId());
		ride.setOrigin(dto.getOrigin());
		ride.setDestination(dto.getDestination());
		ride.setDepartureTime(dto.getDepartureTime());
		ride.setAvailableSeats(dto.getAvailableSeats());
		ride.setPricePerSeat(dto.getPricePerSeat());
		ride.setDriver(driver);
		return ride;
	}
}
