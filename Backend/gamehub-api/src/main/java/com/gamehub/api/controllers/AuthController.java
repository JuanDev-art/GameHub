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
}
