package co.want.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import co.want.services.SseService;
import co.want.util.JwtUtil;

@RestController
@RequestMapping("/notifications")
public class SseController {

	private final SseService sseService;

	public SseController(SseService sseService) {
		this.sseService = sseService;
	}

	@GetMapping
	public SseEmitter subscribe(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
		}
		Long userId = JwtUtil.extractUserId(authentication);
		return sseService.subscribe(userId);
	}
}