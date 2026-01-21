package co.want.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import co.want.config.JwtProvider;
import co.want.dtos.UserAuthenticate;
import co.want.dtos.UserCreate;
import co.want.entities.User;
import co.want.repositories.UserRepository;

public class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private JwtProvider jwtProvider;

	@InjectMocks
	private UserService userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	// create()
	@Test
	void create_user_success() {
		// Arrange
		UserCreate input = new UserCreate("test@example.com", "password123");
		when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
		when(passwordEncoder.encode("password123")).thenReturn("encodedPwd");
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Act
		ResponseEntity<Void> response = userService.create(input);

		// Assert
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		verify(userRepository).save(any(User.class));
	}

	@Test
	void create_user_conflict_email() {
		// Arrange
		UserCreate input = new UserCreate("test@example.com", "password123");
		when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(true); // simulate existing email

		// Act
		ResponseEntity<Void> response = userService.create(input);

		// Assert
		assertEquals(HttpStatus.CONFLICT, response.getStatusCode()); // 409
		verify(userRepository, never()).save(any(User.class)); // save() isn't called
	}

	// authenticate()
	@Test
	void authenticate_success() {
		// Arrange
		UserAuthenticate input = new UserAuthenticate("test@example.com", "password123");
		User user = new User();
		user.setId(1L);
		user.setPassword("encodedPwd");

		when(userRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(user);
		when(passwordEncoder.matches("password123", "encodedPwd")).thenReturn(true);
		when(jwtProvider.create("test@example.com", 1L)).thenReturn("dummy-token");

		// Act
		Object token = userService.authenticate(input);

		// Assert
		assertEquals("dummy-token", token);
	}

	@Test
	void authenticate_no_user() {
		// Arrange
		UserAuthenticate input = new UserAuthenticate("test@example.com", "password123");
		when(userRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(null);

		// Act / Assert
		assertThrows(BadCredentialsException.class, () -> userService.authenticate(input));
	}

	@Test
	void authenticate_pwd_incorrect() {
		// Arrange
		UserAuthenticate input = new UserAuthenticate("test@example.com", "wrongpassword");
		User user = new User();
		user.setId(1L);
		user.setPassword("encodedPwd");

		when(userRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(user);
		when(passwordEncoder.matches("wrongpassword", "encodedPwd")).thenReturn(false);

		// Act / Assert
		assertThrows(BadCredentialsException.class, () -> userService.authenticate(input));
	}
}
