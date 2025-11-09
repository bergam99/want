package co.want.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "t_review_likes", uniqueConstraints = { @UniqueConstraint(columnNames = { "review_id", "user_id" }) })
public class LikeReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "review_id")
	private Long reviewId;

	@Column(name = "user_id")
	private Long userId;

	public LikeReview() {
		// Required no-arg constructor for Hibernate
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getReviewId() {
		return reviewId;
	}

	public void setReviewId(Long reviewId) {
		this.reviewId = reviewId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "LikeReview [id=" + id + ", reviewId=" + reviewId + ", userId=" + userId + "]";
	}

}
