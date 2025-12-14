package co.want.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import com.auth0.jwt.algorithms.Algorithm;

@Configuration
public class SecurityConfig {

	// from application.properties
	@Value("${want.jwt.secret}")
	private String secret;

	@Value("${want.jwt.expiration}")
	private long expiration;

	@Bean
	PasswordEncoder encoder() {
		return new BCryptPasswordEncoder(12);
	}

	@Bean
	JwtProvider jwtProvider() {
		Algorithm algorithm = Algorithm.HMAC256(secret); // signature with HMAC256 algo
		return new JwtProvider(algorithm, expiration);
	}

	// client -> server (token verify) detect Authorization header
	// verify secret key
	@Bean
	JwtDecoder jwtDecoder() {
		SecretKey secretKey = new SecretKeySpec(secret.getBytes(), "HMACSHA256");
		NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();
		return decoder;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.cors(Customizer.withDefaults()).csrf((csrf) -> csrf.disable())
				.authorizeHttpRequests(
						(req) -> req.requestMatchers(HttpMethod.POST, "/auth/signup", "/auth/login")
						.anonymous().requestMatchers(
				                HttpMethod.GET, "/test").permitAll()
						)
				.authorizeHttpRequests((reqs) -> reqs.anyRequest().authenticated())
				.oauth2ResourceServer((srv) -> srv.jwt(Customizer.withDefaults())).build(); // go to JwtDecoder
	}
}