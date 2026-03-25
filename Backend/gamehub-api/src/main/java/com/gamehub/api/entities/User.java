package com.gamehub.api.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; //PK
	
	private String username;
	private String password;
	private String email;
	@Column(name="fecha_registro")
	private LocalDate registrationDay;
	private String role;
	 
	@PrePersist //Hibernate asigna la fecha de creación de usuario.
	public void setRegistrationDate() {
	    this.registrationDay = LocalDate.now();
	}
	
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore //Le decimos a Jackson que cuando convierta User a JSON ignore matches.
	private List<Match> matches = new ArrayList<>();


	public User() {
		super();
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public LocalDate getRegistrationDay() {
		return registrationDay;
	}


	public void setRegistrationDay(LocalDate registrationDay) {
		this.registrationDay = registrationDay;
	}


	public String getRole() {
		return role;
	}


	public void setRole(String role) {
		this.role = role;
	}


	public List<Match> getMatches() {
		return matches;
	}


	public void setMatches(List<Match> matches) {
		this.matches = matches;
	}
	
	

}
