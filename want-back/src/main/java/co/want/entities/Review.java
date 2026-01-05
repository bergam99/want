package co.want.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_reviews")
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "osm_id")
	private Long osmId;

	@Column(name = "user_id")
	private Long userId;

	@Column(name = "comment")
	private String comment;

	@Column(name = "rating")
	private Integer rating;

	@Column(name = "time_stamp")
	private Instant timeStamp;

	@Column(name = "like_count")
	private Integer likeCount;

	public Review() {
		// constructor without argument
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOsmId() {
		return osmId;
	}

	public void setOsmId(Long osmId) {
		this.osmId = osmId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public Instant getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(Instant timeStamp) {
		this.timeStamp = timeStamp;
	}

	public Integer getLikeCount() {
		return likeCount;
	}

	public void setLikeCount(Integer likeCount) {
		this.likeCount = likeCount;
	}

	@Override
	public String toString() {
		return "Review [id=" + id + ", osmId=" + osmId + ", userId=" + userId + ", comment=" + comment + ", rating="
				+ rating + ", timeStamp=" + timeStamp + ", likeCount=" + likeCount + "]";
	}

}