package co.want.projections;

import java.time.Instant;

public interface ReviewType {
	Long getId();

	Long getOsmId();

	String getComment();

	Integer getRating();

	String getAmenity();

	String getUserEmail(); // joined from t_users

	Instant getTimeStamp();

	Integer getLikeCount();

}
