package com.gamehub.api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.api.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	//Ejemplo de consulta automática por nombre de usuario.
	User findByUsername(String username);
	
	//Método para el login
	Optional<User> findByEmail(String email);
	
	//Comprobamos si al registrarse el email ya existe
	Boolean existsByEmail(String email);

}
