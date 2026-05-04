package com.gamehub.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.api.entities.Match;

public interface MatchRepository extends JpaRepository<Match, Long>{
	
	List<Match> findByUserId(Long userId);
	List<Match> findByGameId(Long gameId);
	List<Match> findTop10ByGameIdOrderByScoreDesc(Long gameId);
	
	Optional<Match> findTopByUserIdAndGameIdOrderByScoreDesc(Long userId, Long gameId);


}
