package co.want.projections;

//query result mapping
public interface ReviewScoreType {

	String getUserEmail();

	Integer getReviewCount();

	Integer getTotalLikes();

	Integer getScore(); // reviewCount + totalLikes
}
