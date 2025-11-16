package com.share2go.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.share2go.dto.UserDTO;
import com.share2go.mapper.UserMapper;
import com.share2go.model.User;
import com.share2go.repository.UserRepository;
import com.share2go.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public UserDTO createUser(UserDTO userDTO) {
		User user = UserMapper.toEntity(userDTO);
		// Encode password before saving
		user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		User savedUser = userRepository.save(user);
		return UserMapper.toDTO(savedUser);
	}

	@Override
	public UserDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		return UserMapper.toDTO(user);
	}

	@Override
	public List<UserDTO> getAllUser() {
		return userRepository.findAll().stream().map(UserMapper::toDTO).toList();
	}

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

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		var user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),
				user.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public Optional<User> findById(Long id) {
		return userRepository.findById(id);
	}

}
