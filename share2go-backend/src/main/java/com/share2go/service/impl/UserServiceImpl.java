package com.share2go.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.share2go.dto.UserDTO;
import com.share2go.mapper.UserMapper;
import com.share2go.model.User;
import com.share2go.repository.UserRepository;
import com.share2go.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDTO createUser(UserDTO userDTO) {
		User user = UserMapper.toEntity(userDTO);
		User savedUser = userRepository.save(user);
		return UserMapper.toDTO(savedUser);
	}

	@Override
	public UserDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		return UserMapper.toDTO(user);
	}

	// Get all users
	@Override
	public List<UserDTO> getAllUser() {
		return userRepository.findAll().stream().map(UserMapper::toDTO).toList();
	}

	// Update user
	@Override
	public UserDTO updateUser(Long id, UserDTO userDTO) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));

		existingUser.setName(userDTO.getName());
		existingUser.setEmail(userDTO.getEmail());
		existingUser.setPhone(userDTO.getPhone());
		existingUser.setPassword(userDTO.getPassword());
		existingUser.setRole(userDTO.getRole());

		User updatedUser = userRepository.save(existingUser);
		return UserMapper.toDTO(updatedUser);
	}

	@Override
	public void deleteUser(Long id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found with id: " + id);
		}
		userRepository.deleteById(id);
	}

	@Override
	public UserDTO login(String email, String password) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Invalid email or password"));

		if (!user.getPassword().equals(password)) {
			throw new RuntimeException("Invalid email or password");
		}

		return UserMapper.toDTO(user);
	}
}
