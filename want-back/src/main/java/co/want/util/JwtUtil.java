package co.want.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JwtUtil {

	private static String extractToken(Authentication authentication) {
		if (authentication instanceof JwtAuthenticationToken jwtAuth) {
			return jwtAuth.getToken().getTokenValue();
		} else {
			throw new IllegalArgumentException("Unsupported authentication type");
		}
	}

	// extract userId (Long)
	public static Long extractUserId(Authentication authentication) {
		String token = extractToken(authentication);
		DecodedJWT decoded = JWT.decode(token);
		return decoded.getClaim("userId").asLong();
	}

	// extract email (String)
	public static String extractEmail(Authentication authentication) {
		String token = extractToken(authentication);
		DecodedJWT decoded = JWT.decode(token);
		return decoded.getClaim("email").asString();
	}
}
