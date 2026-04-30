package com.gamehub.api.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
									HttpServletResponse response,
									FilterChain filterChain)
				throws ServletException, IOException {
		
		//Leer la cabecera Authorization
		String headerAuth = request.getHeader("Authorization");
		
		//Comprobar que existe y que empieza por "Bearer "
		if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
			
			//Extraer el token quitando "Bearer " (y el espacio)
			String token = headerAuth.substring(7);
			
			//Validar el token
			if(jwtUtils.validateJwtToken(token)) {
				
				//Extraer el email del token
				String email = jwtUtils.getUserNameFromJwtToken(token);
				
				//Crear la autenticación y meterla en el contexto de seguridad
				UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
				
				SecurityContextHolder.getContext()
					.setAuthentication(authentication);
			}
			
		}
		
		//Continuamos con la cadena de filtros
		filterChain.doFilter(request, response);
	}

}
