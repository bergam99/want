package co.want.config;

import java.time.Instant;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;

public class JwtProvider {
	private final Algorithm algorithm;

	private final long expiration;

	JwtProvider(Algorithm algorithm, long expiration) {
		this.algorithm = algorithm;
		this.expiration = expiration;
	}

	public String create(String email, long userId) { // subject = email

		Instant issuedAt = Instant.now();

		Builder builder = JWT.create().withIssuedAt(issuedAt).withSubject(email).withClaim("userId", userId);

		if (expiration > -1) { // if expiration exist
			Instant expiresAt = issuedAt.plusSeconds(expiration);
			builder.withExpiresAt(expiresAt); // + exp
		}
		return builder.sign(algorithm);
	}

	/**
	 * header = { "alg": "HS256", "typ": "JWT" },
	 * 
	 * payload = { "sub": "user@email.com", "userId": 1, "iat": 1718137200, "exp":
	 * 1718140800 } (claims),
	 * 
	 * signature = HMACSHA256( base64UrlEncode(header) + "." +
	 * base64UrlEncode(payload), secret )
	 * 
	 * secret from application.properties
	 * 
	 */
}
