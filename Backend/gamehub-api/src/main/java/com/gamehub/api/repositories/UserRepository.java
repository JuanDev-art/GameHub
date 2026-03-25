package com.gamehub.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.api.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	//Ejemplo de consulta automática por nombre de usuario.
	User findByUsername(String username);

}
