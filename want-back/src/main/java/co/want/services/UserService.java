package co.want.services;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.want.config.JwtProvider;
import co.want.dtos.UserAuthenticate;
import co.want.dtos.UserCreate;
import co.want.entities.User;
import co.want.repositories.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder encoder;
	private JwtProvider provider;

	public UserService(UserRepository userRepository, PasswordEncoder encoder, JwtProvider provider) {
		this.userRepository = userRepository;
		this.encoder = encoder;
		this.provider = provider;
	}

	public ResponseEntity<Void> create(UserCreate inputs) {
		String normalizedEmail = inputs.email().toLowerCase();
		if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409
		}

		User user = new User();
		user.setEmail(normalizedEmail);
		String rawPassword = inputs.password();
		String encodedPassword = encoder.encode(rawPassword);
		user.setPassword(encodedPassword);
		userRepository.save(user);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	public Object authenticate(UserAuthenticate inputs) {
		String token = null;
		String normalizedEmail = inputs.email().trim().toLowerCase(Locale.ROOT);

		User user = userRepository.findByEmailIgnoreCase(normalizedEmail);

		if (user == null) {
			throw new BadCredentialsException("Bad credentials");
		} else {
			String encoded = user.getPassword();
			String rawPassword = inputs.password();

			if (!encoder.matches(rawPassword, encoded)) { // compare entered pwd & encoded pwd from db
				throw new BadCredentialsException("Bad credentials");
			} else {
				long userId = user.getId();
				token = provider.create(normalizedEmail, userId);
			}
		}
		return token;
	}
}