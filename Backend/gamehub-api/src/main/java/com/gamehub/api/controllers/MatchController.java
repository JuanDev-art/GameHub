package com.gamehub.api.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.api.dto.MatchRequest;
import com.gamehub.api.dto.MatchResponse;
import com.gamehub.api.services.MatchService;


@CrossOrigin(
		origins = "http://localhost:5173",
		allowedHeaders = "*",
		methods = { RequestMethod.GET, RequestMethod.POST })
@RestController
@RequestMapping("/api/matches")
public class MatchController {
	
	private final MatchService matchService;
	
	public MatchController(MatchService matchService) {
		this.matchService = matchService;
	}
	
	//Endpoint 1 — Obtener todas las partidas --> GET /api/matches
	//Devuelve todas las partidas guardadas en la base de datos.
	@GetMapping
	public List<MatchResponse> getAllMatches() {
		return matchService.getAllMatches();
	}
	
	//Endpoint 2 — Obtener partidas de un usuario --> GET /api/matches/user/3 --> Dame todas las partidas del usuario con id 3
	@GetMapping("/user/{userId}")
	public List<MatchResponse> getMatchesByUser(@PathVariable Long userId) {
		return matchService.getMatchesByUser(userId);
	}
	
	//Endpoint 3 — Obtener partidas de un juego --> GET /api/matches/game/2
	//Dame todas las partidas del juego con id 2
	@GetMapping("/game/{gameId}")
	public List<MatchResponse> getMatchesByGame(@PathVariable Long gameId) {
		return matchService.getMatchesByGame(gameId);
	}
	
	//Endpoint 4 — Crear una partida --> POST /api/matches
	@PostMapping
	public MatchResponse createMatch(@RequestBody MatchRequest request) throws Exception {
		return matchService.createMatch(request);
	}
	
	//Endpoint 5 — Top 10 puntuaciones por juego --> GET /api/matches/top/1
	@GetMapping("/top/{gameId}")
	public List<MatchResponse> getTopByGame(@PathVariable Long gameId) {
	    return matchService.getTopByGame(gameId);
	}

}
