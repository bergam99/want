import { useRouteLoaderData } from "react-router";
import { useReviewsStore, type ReviewType } from "../../../../store/reviews";
import { emailFormatter, getFranceTime } from "../../../../utils";
import "./ReviewItem.css";
import { jwtDecoder } from "../../../Auth/Auth_utils";
// import SvgStar from "@/assets/svg/star.svg"; TODO
import SvgLike from "@/assets/svg/like.svg";

type ReviewItemType = {
  review: ReviewType;
  isDisplayMode?: boolean;
};
const ReviewItem = ({ review, isDisplayMode }: ReviewItemType) => {
  const {
    toggleLike,
    isLoading,
    deleteReview,
    setEditingReview,
    setIsWriteMode,
  } = useReviewsStore();
  const token = useRouteLoaderData("root") as string | null;
  const decodedToken = jwtDecoder(token);
  const userEmail = decodedToken?.sub;

  const handleEditClick = (review: ReviewType) => {
    setEditingReview(review);
    setIsWriteMode(true);
  };

  const handleDelete = (token: string | null, reviewId?: number) => {
    if (!token || !reviewId) return;
    deleteReview(token, reviewId);
  };

  return (
    <div className="ReviewItem">
      {isDisplayMode ? (
        <p>About {review.amenity}</p>
      ) : (
        <p className="ReviewItem__user">
          {emailFormatter(review.userEmail) || "Unknown User"}
        </p>
      )}

      <div className="ReviewItem__SvgStarsTimeContainer">
        <div className="ReviewItem__SvgStars">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star}>
              {/* <SvgStar color={star <= review.rating ? "#000000" : "#dddddd"} /> */}
            </div>
          ))}
        </div>

        <span className="ReviewItem__spot">·</span>

        <p className="ReviewItem__time">{getFranceTime(review.timeStamp)}</p>
      </div>
      <p className="ReviewItem__comment">{review.comment}</p>
      {isDisplayMode ? (
        <p className="ReviewItem__likeCount"> {review.likeCount} liked</p>
      ) : (
        <button
          className="ReviewItem__SvgLike"
          disabled={isLoading}
          onClick={() => review.id && token && toggleLike(review.id, token)}
        >
          <SvgLike />
          {review.likeCount}
        </button>
      )}

      {review.userEmail === userEmail && (
        <div className="ReviewItem__buttons">
          <button
            onClick={() => handleEditClick(review)}
            className="ReviewItem__editBtn"
          >
            Edit
          </button>
          <button
            className="ReviewItem__deleteBtn"
            onClick={() => handleDelete(token, review.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
