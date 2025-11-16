package com.share2go.service;

import java.util.List;
import java.util.Optional;
import com.share2go.dto.UserDTO;
import com.share2go.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService {

	UserDTO createUser(UserDTO userDTO);

	UserDTO getUserById(Long id);

	List<UserDTO> getAllUser();

	UserDTO updateUser(Long id, UserDTO userDTO);

	void deleteUser(Long id);

	UserDTO login(String email, String password);

	UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

	// repository-level accessors used by auth logic
	Optional<User> findByEmail(String email);

	Optional<User> findById(Long id);
}
