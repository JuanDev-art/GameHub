package com.gamehub.api.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtils {
	
	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
	
	//Clave secreta
	private final String JWT_SECRET = "EstaEsUnaClaveSuperSecretaParaGameHub2026";
	
	//Token que durará 24 horas, lo pongo en milisegundos
	private final int JWT_EXPIRATION_MS = 86400000;
	
	private Key getSigningKey() {
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
    }
	
	//Generar token
    public String generateJwtToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + JWT_EXPIRATION_MS))
                .signWith(getSigningKey()) 
                .compact();
    }
    
    //Extraer email del token
    public String getUserNameFromJwtToken(String token) {
    	return Jwts.parserBuilder()
    			.setSigningKey(getSigningKey())
    			.build()
    			.parseClaimsJws(token)
    			.getBody()
    			.getSubject();
    			
    	
    }
    
    //Validar que el token sea correcto y que no haya expirado
    public boolean validateJwtToken(String authToken) {
    	try {
    		Jwts.parserBuilder().setSigningKey(getSigningKey())
    		.build()
    		.parseClaimsJws(authToken);
    		
    		return true;
    		
    	} catch(Exception e) {
    		logger.error("Error de validación del token: {}", e.getMessage());
    	}
    	
    	return false;
    	
    }
	

}
