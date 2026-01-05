package co.want.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import co.want.dtos.EditReview;
import co.want.dtos.ReviewCreate;
import co.want.entities.LikeReview;
import co.want.entities.Review;
import co.want.projections.ReviewScoreType;
import co.want.projections.ReviewType;
import co.want.repositories.LikeReviewRepository;
import co.want.repositories.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ReviewService {
	private final ReviewRepository reviewRepository;
	private final LikeReviewRepository likeReviewRepository;

	private final SseService sse;

	public ReviewService(ReviewRepository reviewRepository, LikeReviewRepository likeReviewRepository, SseService sse) {
		this.reviewRepository = reviewRepository;
		this.likeReviewRepository = likeReviewRepository;

		this.sse = sse;
	}

	/**
	 * Create review
	 * 
	 * @param input
	 * @return
	 */
	public ReviewType create(ReviewCreate input) {
		Review review = new Review();
		review.setOsmId(input.osmId());
		review.setUserId(input.userId());
		review.setComment(input.comment());
		review.setRating(input.rating());
		review.setTimeStamp(input.timeStamp());
		review.setLikeCount(input.likeCount());

		Review saved = reviewRepository.save(review);

		return reviewRepository.findReviewByReviewId(saved.getId());
	}

	/**
	 * Get all reviews by OsmId
	 * 
	 * @param osmId
	 * @return founded list
	 */
	public List<ReviewType> readByOsmId(Long osmId) {
		return reviewRepository.findReviewsByOsmId(osmId);
	}

	/**
	 * Toggle Like
	 * 
	 * @param request
	 * @return a modified review object
	 */
	@Transactional
	public ReviewType like(Long reviewId, Long userId) {

		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));

		// Check like status
		Optional<LikeReview> existingLike = likeReviewRepository.findByReviewIdAndUserId(reviewId, userId);

		if (existingLike.isPresent()) {
			// Unlike
			likeReviewRepository.delete(existingLike.get());
			review.setLikeCount(review.getLikeCount() - 1);
		} else {
			// Like
			LikeReview like = new LikeReview();
			like.setReviewId(reviewId);
			like.setUserId(userId);
			likeReviewRepository.save(like);
			review.setLikeCount(review.getLikeCount() + 1);

			// Notify author if liker != author
			Long author = review.getUserId();
			if (!userId.equals(author)) {
				Long liker = userId;
				sse.sendNotification(author, liker); // notify only the author
			}
		}
		// Save updated review
		reviewRepository.save(review);
		return reviewRepository.findReviewByReviewId(reviewId);

	}

	/**
	 * Get Review count + total liked count
	 * 
	 * @return userEmail, reviewCount, totalLikes
	 */
	public List<ReviewScoreType> getScoreboard() {
		return reviewRepository.getScoreBoard();
	}

	public List<ReviewType> getMyReviews(Long userId) {
		return reviewRepository.findReviewsByUserId(userId);
	}

	public ReviewType edit(EditReview updatedReview, Long userId) {
		Long reviewId = updatedReview.id();
		Review foundReview = reviewRepository.findById(reviewId)
				.orElseThrow(() -> new RuntimeException("Review not found"));

		if (!foundReview.getUserId().equals(userId)) {
			throw new AccessDeniedException("You can only edit your own review.");
		}

		foundReview.setComment(updatedReview.comment());
		foundReview.setRating(updatedReview.rating());
		foundReview.setTimeStamp(updatedReview.timeStamp());

		reviewRepository.save(foundReview);

		return reviewRepository.findReviewByReviewId(reviewId);
	}

	public void delete(Long id, Long userId) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Review not found"));

		if (!review.getUserId().equals(userId)) {
			throw new AccessDeniedException("You can only delete your own review.");
		}

		reviewRepository.delete(review);
	}
}