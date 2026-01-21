package co.want.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.MockedStatic;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour JwtUtil
 * IMPORTANT: Ce fichier doit être dans src/test/java/co/want/util/
 * et JwtUtil.java doit être dans src/main/java/co/want/util/
 */
class JwtUtilTest {

    @Test
    @DisplayName("Devrait extraire userId avec succès depuis un JWT valide")
    void testExtractUserId_Success() {
        // Arrange
        Long expectedUserId = 12345L;
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("userId", expectedUserId)
                .claim("email", "test@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT et Claim
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim userIdClaim = mock(Claim.class);
        when(userIdClaim.asLong()).thenReturn(expectedUserId);
        when(decodedJWT.getClaim("userId")).thenReturn(userIdClaim);
        
        // Mock JWT.decode (méthode statique)
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            Long actualUserId = JwtUtil.extractUserId(auth);
            
            // Assert
            assertEquals(expectedUserId, actualUserId);
        }
    }

    @Test
    @DisplayName("Devrait extraire email avec succès depuis un JWT valide")
    void testExtractEmail_Success() {
        // Arrange
        String expectedEmail = "test@example.com";
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("userId", 12345L)
                .claim("email", expectedEmail)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT et Claim
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim emailClaim = mock(Claim.class);
        when(emailClaim.asString()).thenReturn(expectedEmail);
        when(decodedJWT.getClaim("email")).thenReturn(emailClaim);
        
        // Mock JWT.decode
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            String actualEmail = JwtUtil.extractEmail(auth);
            
            // Assert
            assertEquals(expectedEmail, actualEmail);
        }
    }

    @Test
    @DisplayName("Devrait lancer IllegalArgumentException pour un type d'authentification non supporté")
    void testExtractUserId_UnsupportedAuthenticationType() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken("user", "password");
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> JwtUtil.extractUserId(auth)
        );
        
        assertEquals("Unsupported authentication type", exception.getMessage());
    }

    @Test
    @DisplayName("Devrait lancer IllegalArgumentException lors de l'extraction d'email avec auth non supporté")
    void testExtractEmail_UnsupportedAuthenticationType() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken("user", "password");
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> JwtUtil.extractEmail(auth)
        );
        
        assertEquals("Unsupported authentication type", exception.getMessage());
    }

    @Test
    @DisplayName("Devrait gérer un claim userId null")
    void testExtractUserId_NullClaim() {
        // Arrange
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("email", "test@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim userIdClaim = mock(Claim.class);
        when(userIdClaim.asLong()).thenReturn(null);
        when(decodedJWT.getClaim("userId")).thenReturn(userIdClaim);
        
        // Mock JWT.decode
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            Long result = JwtUtil.extractUserId(auth);
            
            // Assert
            assertNull(result);
        }
    }

    @Test
    @DisplayName("Devrait gérer un claim email null")
    void testExtractEmail_NullClaim() {
        // Arrange
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("userId", 12345L)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim emailClaim = mock(Claim.class);
        when(emailClaim.asString()).thenReturn(null);
        when(decodedJWT.getClaim("email")).thenReturn(emailClaim);
        
        // Mock JWT.decode
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            String result = JwtUtil.extractEmail(auth);
            
            // Assert
            assertNull(result);
        }
    }

    @Test
    @DisplayName("Devrait extraire userId avec valeur zéro")
    void testExtractUserId_ZeroValue() {
        // Arrange
        Long expectedUserId = 0L;
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("userId", expectedUserId)
                .claim("email", "test@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim userIdClaim = mock(Claim.class);
        when(userIdClaim.asLong()).thenReturn(expectedUserId);
        when(decodedJWT.getClaim("userId")).thenReturn(userIdClaim);
        
        // Mock JWT.decode
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            Long actualUserId = JwtUtil.extractUserId(auth);
            
            // Assert
            assertEquals(expectedUserId, actualUserId);
        }
    }

    @Test
    @DisplayName("Devrait extraire une chaîne email vide")
    void testExtractEmail_EmptyString() {
        // Arrange
        String expectedEmail = "";
        String tokenValue = "mock.jwt.token";
        
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .claim("userId", 12345L)
                .claim("email", expectedEmail)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
        
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt);
        
        // Mock DecodedJWT
        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        Claim emailClaim = mock(Claim.class);
        when(emailClaim.asString()).thenReturn(expectedEmail);
        when(decodedJWT.getClaim("email")).thenReturn(emailClaim);
        
        // Mock JWT.decode
        try (MockedStatic<JWT> jwtMock = mockStatic(JWT.class)) {
            jwtMock.when(() -> JWT.decode(tokenValue)).thenReturn(decodedJWT);
            
            // Act
            String actualEmail = JwtUtil.extractEmail(auth);
            
            // Assert
            assertEquals(expectedEmail, actualEmail);
        }
    }
}