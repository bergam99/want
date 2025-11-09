package co.want.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.want.dtos.UserAuthenticate;
import co.want.dtos.UserCreate;
import co.want.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class UserController {

	private final UserService service;

	public UserController(UserService service) {
		this.service = service;
	}

	@PostMapping("/signup")
	public ResponseEntity<Void> create(@Valid @RequestBody UserCreate inputs) {
		return service.create(inputs);
	}

	@PostMapping("/login")
	Object authenticate(@Valid @RequestBody UserAuthenticate inputs) {
		return service.authenticate(inputs);
	}
}
