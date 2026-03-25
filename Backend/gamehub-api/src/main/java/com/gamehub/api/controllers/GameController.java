package com.gamehub.api.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.api.entities.Game;
import com.gamehub.api.services.GameService;

import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/games")
public class GameController {
	
	private final GameService gameService;
	
	public GameController(GameService gameService) {
		this.gameService = gameService;
		
		}
	
	//Endpoint 1 — Obtener todos los juegos --> GET /api/games
	@GetMapping
	public List<Game> getAllGames() {
		return gameService.getAllGames();
	}
	
	//Endpoint 2 — Obtener solo juegos activos --> GET /api/games/active
	//Esto usa el método del service --> findByActiveTrue()
	//Que en SQL sería --> SELECT * FROM games WHERE active = true;
	@GetMapping("/active")
	public List<Game> getActiveGames() {
		return gameService.getActiveGames();
	}
	
	//Endpoint 3 — Crear un juego --> POST /api/games
	@PostMapping
	public Game createGame(@RequestBody Game game) {
		return gameService.saveGame(game);
	}
	
	//Endpoint 4 - ${id}
	@GetMapping("/{id}")
	public Game getGameById(@PathVariable Long id) {
	    return gameService.getGameById(id);
	}
	
}
