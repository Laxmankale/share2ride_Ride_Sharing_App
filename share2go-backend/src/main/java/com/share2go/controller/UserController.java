package com.share2go.controller;

import com.share2go.dto.UserDTO;
import com.share2go.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public UserDTO registerUser(@RequestBody UserDTO userDTO) {
		return userService.createUser(userDTO);
	}

	@PostMapping("/login")
	public UserDTO login(@RequestParam String email, @RequestParam String password) {
		return userService.login(email, password);
	}

	@GetMapping
	public List<UserDTO> getAllUsers() {
		return userService.getAllUser();
	}

	@GetMapping("/{id}")
	public UserDTO getUserById(@PathVariable Long id) {
		return userService.getUserById(id);
	}

	@PutMapping("/{id}")
	public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
		return userService.updateUser(id, userDTO);
	}

	@DeleteMapping("/{id}")
	public String deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return "User deleted successfully!";
	}
}
