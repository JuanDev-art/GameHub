package com.gamehub.api.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gamehub.api.dto.MatchRequest;
import com.gamehub.api.dto.MatchResponse;
import com.gamehub.api.entities.Game;
import com.gamehub.api.entities.Match;
import com.gamehub.api.entities.User;
import com.gamehub.api.repositories.GameRepository;
import com.gamehub.api.repositories.MatchRepository;
import com.gamehub.api.repositories.UserRepository;

@Service
public class MatchService {
	
	private final MatchRepository matchRepository;
	private final UserRepository userRepository;
	private final GameRepository gameRepository;
	
	public MatchService(MatchRepository matchRepository, UserRepository userRepository, GameRepository gameRepository) {
		this.matchRepository = matchRepository;
		this.userRepository = userRepository;
		this.gameRepository = gameRepository;
	}
	
	//Obtener todas las partidas
	public List<MatchResponse> getAllMatches() {
		
		return matchRepository.findAll()
				.stream()
				.map(this::toMatchResponse)
				.toList();
		
	}
	
	//Obtener partidas por usuario
	public List<MatchResponse> getMatchesByUser(Long userId) {
		
		return matchRepository.findByUserId(userId)
				.stream()
				.map(this::toMatchResponse)
				.toList();
	}
	
	//Obtener partidas por juego
	public List<MatchResponse> getMatchesByGame(Long gameId) {
		
		return matchRepository.findByGameId(gameId)
				.stream()
				.map(this::toMatchResponse)
				.toList();
	}
	
	//Guardar partida
	public Match saveMatch(Match match) {
		
		return matchRepository.save(match);
	}
	
	//Crear partida usando MatchRequest
	public MatchResponse createMatch(MatchRequest request) throws Exception {
		
		//Buscar usuario
		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new Exception("User not found"));
		
		//Buscar juego
		Game game = gameRepository.findById(request.getGameId())
				.orElseThrow(() -> new Exception("Game not found"));
		
		//Crear objeto Match
		Match match = new Match();
		match.setScore(request.getScore());
		match.setDurationSeconds(request.getDurationSeconds());
		match.setDate(LocalDateTime.now());
		match.setUser(user);
		match.setGame(game);
		
		//Guardar en la BD
		Match savedMatch = matchRepository.save(match);
		
		return toMatchResponse(savedMatch);
	}
	
	//Convertir Match --> MatchResponse
	private MatchResponse toMatchResponse(Match match) {
		
		MatchResponse response = new MatchResponse();
		response.setId(match.getId());
		response.setScore(match.getScore());
		response.setDurationSeconds(match.getDurationSeconds());
		response.setDate(match.getDate());
		response.setUsername(match.getUser().getUsername());
		response.setGameName(match.getGame().getName());
		return response;
	}

}
