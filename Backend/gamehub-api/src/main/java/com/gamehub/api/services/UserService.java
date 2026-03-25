package com.gamehub.api.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gamehub.api.entities.User;
import com.gamehub.api.repositories.UserRepository;

@Service
public class UserService {
	
	private final UserRepository userRepository;
	
	//Constructor para inyección de dependencias.
	//Inyección de dependencias → no creamos new UserRepository(), Spring lo hace por nosotros.
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	//Obtener todos los usuarios.
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}
	
	//Buscar por username.
	public User getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}
	
	//Guardar un usuario.
	public User saveUser(User user) {
		return userRepository.save(user);
	}

}
