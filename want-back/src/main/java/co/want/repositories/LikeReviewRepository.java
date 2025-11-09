package co.want.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.want.entities.LikeReview;

public interface LikeReviewRepository extends JpaRepository<LikeReview, Long> {
	Optional<LikeReview> findByReviewIdAndUserId(Long reviewId, Long userId);

}
