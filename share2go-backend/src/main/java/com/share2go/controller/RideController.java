package com.share2go.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.share2go.dto.RideDTO;
import com.share2go.service.RideService;

@RestController
@RequestMapping("/api/rides")
public class RideController {

	private final RideService rideService;

	public RideController(RideService rideService) {
		super();
		this.rideService = rideService;
	}

	@PostMapping("/driver/{driverId}")
	public ResponseEntity<RideDTO> createRide(@PathVariable Long driverId, @RequestBody RideDTO rideDTO) {
		return ResponseEntity.ok(rideService.createRide(rideDTO, driverId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RideDTO> getRideById(@PathVariable Long id) {
		return ResponseEntity.ok(rideService.getRideById(id));
	}

	@GetMapping
	public ResponseEntity<List<RideDTO>> getAllRides() {
		return ResponseEntity.ok(rideService.getAllRides());
	}

	@GetMapping("/search")
	public ResponseEntity<List<RideDTO>> searchRides(@RequestParam String origin, @RequestParam String destination,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime) {
		return ResponseEntity.ok(rideService.searchRides(origin, destination, departureTime));
	}

	@PutMapping("/{id}")
	public ResponseEntity<RideDTO> updateRide(@PathVariable Long id, @RequestBody RideDTO rideDTO) {
		return ResponseEntity.ok(rideService.updateRide(id, rideDTO));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteRide(@PathVariable Long id) {
		rideService.deleteRide(id);
		return ResponseEntity.ok("Ride deleted successfully");
	}

	@GetMapping("/driver/{driverId}")
	public ResponseEntity<List<RideDTO>> getRidesByDriver(@PathVariable Long driverId) {
		return ResponseEntity.ok(rideService.getRidesByDriver(driverId));
	}
}
