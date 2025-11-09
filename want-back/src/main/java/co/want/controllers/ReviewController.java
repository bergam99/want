package co.want.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.want.dtos.EditReview;
import co.want.dtos.ReviewCreate;
import co.want.projections.ReviewScoreType;
import co.want.projections.ReviewType;
import co.want.services.ReviewService;
import co.want.util.JwtUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/review")
public class ReviewController {

	private final ReviewService service;

	public ReviewController(ReviewService service) {
		this.service = service;
	}

	@PostMapping("/create")
	public ResponseEntity<ReviewType> create(@Valid @RequestBody ReviewCreate input) {
		ReviewType response = service.create(input);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/read/{osmId}")
	public List<ReviewType> readByOsmId(@PathVariable Long osmId) {
		return service.readByOsmId(osmId);
	}

	@PostMapping("/like/{reviewId}")
	public ResponseEntity<ReviewType> like(@PathVariable Long reviewId, Authentication authentication) {
		Long userId = JwtUtil.extractUserId(authentication);
		ReviewType updatedReview = service.like(reviewId, userId);
		return ResponseEntity.ok(updatedReview);
	}

	@GetMapping("/scoreboard")
	public List<ReviewScoreType> getScoreboard() {
		return service.getScoreboard();
	}

	@GetMapping("/my-reviews")
	public List<ReviewType> getMyReviews(Authentication authentication) {
		Long userId = JwtUtil.extractUserId(authentication);
		return service.getMyReviews(userId);
	}

	@PutMapping("/edit")
	public ResponseEntity<ReviewType> edit(@Valid @RequestBody EditReview updatedReview,
			Authentication authentication) {
		Long userId = JwtUtil.extractUserId(authentication);
		ReviewType result = service.edit(updatedReview, userId);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping("/delete/{id}")
	public void delete(@PathVariable Long id, Authentication authentication) {
		Long userId = JwtUtil.extractUserId(authentication);
		service.delete(id, userId);
	}
}
