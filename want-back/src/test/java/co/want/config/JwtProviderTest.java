package co.want.config;

import static org.junit.jupiter.api.Assertions.*;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


class JwtProviderTest {

    private JwtProvider jwtProvider;
    private final String secret = "test-secret-key";
    private final Algorithm algorithm = Algorithm.HMAC256(secret);
    private final long expirationSeconds = 3600; // 1 hour

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider(algorithm, expirationSeconds);
    }

    @Test
    @DisplayName("Should create a valid JWT with correct claims")
    void create_ShouldGenerateValidToken() {
        // Arrange
        String email = "test@example.com";
        long userId = 123L;

        // Act
        String token = jwtProvider.create(email, userId);

        // Assert
        assertNotNull(token);

        // Decode and verify the token contents
        DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
        
        assertEquals(email, decodedJWT.getSubject());
        assertEquals(userId, decodedJWT.getClaim("userId").asLong());
        assertNotNull(decodedJWT.getIssuedAt());
        assertNotNull(decodedJWT.getExpiresAt());
        
        // Check if expiration is roughly 1 hour from now
        long diff = decodedJWT.getExpiresAt().getTime() - decodedJWT.getIssuedAt().getTime();
        assertEquals(expirationSeconds * 1000, diff);
    }

    @Test
    @DisplayName("Should not include expiration claim if expiration is -1")
    void create_NoExpiration_ShouldNotHaveExpClaim() {
        // Arrange
        JwtProvider noExpProvider = new JwtProvider(algorithm, -1);
        
        // Act
        String token = noExpProvider.create("no-exp@test.com", 1L);
        DecodedJWT decodedJWT = JWT.decode(token);

        // Assert
        assertNull(decodedJWT.getExpiresAt());
    }

    @Test
    @DisplayName("Should fail verification if a different secret is used")
    void create_VerificationShouldFailWithWrongSecret() {
        // Arrange
        String token = jwtProvider.create("user@test.com", 1L);
        Algorithm wrongAlgorithm = Algorithm.HMAC256("completely-different-secret");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            JWT.require(wrongAlgorithm).build().verify(token);
        });
    }
}