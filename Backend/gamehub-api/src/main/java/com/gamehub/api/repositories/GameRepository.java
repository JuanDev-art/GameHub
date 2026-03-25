package com.gamehub.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.api.entities.Game;


public interface GameRepository extends JpaRepository<Game, Long>{
	
	//Ejemplo de buscar juegos activos.
	List<Game> findByActiveTrue();

}
