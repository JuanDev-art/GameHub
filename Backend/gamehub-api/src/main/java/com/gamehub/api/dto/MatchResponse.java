package com.gamehub.api.dto;

import java.time.LocalDateTime;

public class MatchResponse {
	
	private Long id;
    private int score;
    private int durationSeconds;
    private LocalDateTime date;
    private String username;
    private String gameName;
    
	public MatchResponse() {
		super();
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public int getDurationSeconds() {
		return durationSeconds;
	}
	public void setDurationSeconds(int durationSeconds) {
		this.durationSeconds = durationSeconds;
	}
	public LocalDateTime getDate() {
		return date;
	}
	public void setDate(LocalDateTime date) {
		this.date = date;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getGameName() {
		return gameName;
	}
	public void setGameName(String gameName) {
		this.gameName = gameName;
	}
	
    
	

}
