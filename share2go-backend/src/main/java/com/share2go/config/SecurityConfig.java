package com.share2go.config;

import com.share2go.auth.JwtAuthenticationFilter;
import com.share2go.auth.JwtUtil;
import com.share2go.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	private final JwtUtil jwtUtil;
	private final UserService userService;

	public SecurityConfig(JwtUtil jwtUtil, @Lazy UserService userService) {
		this.jwtUtil = jwtUtil;
		this.userService = userService;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		var jwtFilter = new JwtAuthenticationFilter(jwtUtil, userService);

		http.cors(cors -> cors.configurationSource(request -> {
			var config = new org.springframework.web.cors.CorsConfiguration();
			config.addAllowedOrigin("http://localhost:5173");
			config.addAllowedOrigin("https://share2ride-ride-sharing-app.onrender.com");
			config.addAllowedOrigin("https://share2ride-ride-sharing-app.vercel.app");
			config.addAllowedHeader("*");
			config.addAllowedMethod("*");
			config.setAllowCredentials(true);
			return config;
		})).csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(
						org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(
						auth -> auth.requestMatchers("/auth/**", "/h2-console/**", "/public/**", "/api/users/register")
								.permitAll().anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		http.headers(h -> h.frameOptions(frame -> frame.sameOrigin()));

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
