package com.gamehub.api.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.api.dto.LoginRequest;
import com.gamehub.api.entities.User;
import com.gamehub.api.repositories.UserRepository;
import com.gamehub.api.security.jwt.JwtUtils;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		
		// 1. Buscar usuario por email
		Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

		if (userOptional.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }

		User user = userOptional.get();
		
		//Generación de token
		String jwt = jwtUtils.generateJwtToken(user.getEmail());
		
		Map<String, String> response = new HashMap<>();
		response.put("token", jwt);
		response.put("username", user.getUsername());
		response.put("role", user.getRole());
		
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		
		//Validamos si el email existe
		if (userRepository.findByEmail(user.getEmail()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: El email ya está registrado");
			
		}
		//Ciframos contraseña
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		if (user.getRole() == null || user.getRole().isEmpty()) {
			user.setRole("USER");
		}
		
		//Guardamos en la base de datos
		userRepository.save(user);
		
		return ResponseEntity.ok("Usuario registrado con éxito");
	}
	
	
}
