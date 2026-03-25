package com.gamehub.api.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gamehub.api.entities.Game;
import com.gamehub.api.repositories.GameRepository;


@Service
public class GameService {
	
	private final GameRepository gameRepository;
	
	public GameService(GameRepository gameRepository) {
		this.gameRepository = gameRepository;
	}
	
	//Obtenemos todos los juegos 
	public List<Game> getAllGames() {
		return gameRepository.findAll();
	}
	
	//Obtenemos solo juegos activos
	public List<Game> getActiveGames() {
		return gameRepository.findByActiveTrue();
	}
	
	//Guardar juego
	public Game saveGame (Game game) {
		return gameRepository.save(game);
	}
	
	//Obtenemos juegos por id
	public Game getGameById(Long id) {
	    return gameRepository.findById(id).orElse(null);
	}
	

}
