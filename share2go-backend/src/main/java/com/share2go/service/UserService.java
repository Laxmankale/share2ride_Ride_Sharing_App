package com.share2go.service;

import java.util.List;

import com.share2go.dto.UserDTO;

public interface UserService {

	UserDTO createUser(UserDTO userDTO);

	UserDTO getUserById(Long id);

	List<UserDTO> getAllUser();

	UserDTO updateUser(Long id, UserDTO userDTO);

	void deleteUser(Long id);

	// Extra feature: Login
	UserDTO login(String email, String password);
}
