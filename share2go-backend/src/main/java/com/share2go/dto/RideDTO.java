package com.share2go.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RideDTO {
    private Long id;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private int availableSeats;
    private double pricePerSeat;

    private Long driverId;       
    private String driverName;      
    private List<Long> passengerIds;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getOrigin() {
		return origin;
	}
	public void setOrigin(String origin) {
		this.origin = origin;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public LocalDateTime getDepartureTime() {
		return departureTime;
	}
	public void setDepartureTime(LocalDateTime departureTime) {
		this.departureTime = departureTime;
	}
	public int getAvailableSeats() {
		return availableSeats;
	}
	public void setAvailableSeats(int availableSeats) {
		this.availableSeats = availableSeats;
	}
	public double getPricePerSeat() {
		return pricePerSeat;
	}
	public void setPricePerSeat(double pricePerSeat) {
		this.pricePerSeat = pricePerSeat;
	}
	public Long getDriverId() {
		return driverId;
	}
	public void setDriverId(Long driverId) {
		this.driverId = driverId;
	}
	public String getDriverName() {
		return driverName;
	}
	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}
	public List<Long> getPassengerIds() {
		return passengerIds;
	}
	public void setPassengerIds(List<Long> passengerIds) {
		this.passengerIds = passengerIds;
	}
    
}
