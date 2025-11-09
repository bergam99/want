package co.want.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.want.entities.Review;
import co.want.projections.ReviewScoreType;
import co.want.projections.ReviewType;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	/**
	 * find matching osmId and join with userEmail
	 * 
	 * @param osmId
	 * @return ReviewType
	 */
	@Query("""
			    SELECT r.id AS id, r.osmId AS osmId, r.comment AS comment,
			           r.rating AS rating, r.timeStamp AS timeStamp, r.likeCount AS likeCount,
			           r.amenity AS amenity, u.email AS userEmail
			    FROM Review r
			    LEFT JOIN User u ON r.userId = u.id
			    WHERE r.osmId = :osmId
			""")
	List<ReviewType> findReviewsByOsmId(Long osmId);

	/**
	 * find matching review_id and join with userEmail
	 * 
	 * @param reviewId
	 * @return ReviewType
	 */
	@Query("""
			    SELECT r.id AS id, r.osmId AS osmId, r.comment AS comment, r.rating AS rating,
			           r.amenity AS amenity, u.email AS userEmail, r.timeStamp AS timeStamp, r.likeCount AS likeCount
			    FROM Review r
			    JOIN User u ON r.userId = u.id
			    WHERE r.id = :reviewId
			""")
	ReviewType findReviewByReviewId(@Param("reviewId") Long reviewId);

	/**
	 * get top 10 users
	 * 
	 * @return ReviewScoreType
	 */
	@Query(value = """
			SELECT u.email AS userEmail,
			       COUNT(*) AS reviewCount,
			       SUM(r.like_count) AS totalLikes,
			       COUNT(*) + SUM(r.like_count) AS score
			FROM t_reviews r
			JOIN t_users u ON r.user_id = u.id
			GROUP BY u.email
			ORDER BY score DESC
			LIMIT 10
			""", nativeQuery = true)

	List<ReviewScoreType> getScoreBoard();

	/**
	 * get user's review list
	 * 
	 * @param userId
	 * @return ReviewType
	 */
	@Query("""
			    SELECT r.id AS id, r.osmId AS osmId, r.comment AS comment,
			           r.rating AS rating, r.timeStamp AS timeStamp, r.likeCount AS likeCount,
			           r.amenity AS amenity, u.email AS userEmail
			    FROM Review r
			    JOIN User u ON r.userId = u.id
			    WHERE r.userId = :userId
			""")
	List<ReviewType> findReviewsByUserId(@Param("userId") Long userId);

}
