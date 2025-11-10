import { Fragment, useEffect, useRef, useState } from "react";
import { useReviewsStore } from "../../../../../store/reviews";
import { getAverageRating, getRatingCounts } from "../../../../../utils";
import "./PopupReviewDisplayMode.css";
import ReviewItem from "../../ReviewItem/ReviewItem";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DescriptionBox from "../../../DescriptionBox/DescriptionBox";
import SvgPen from "@/assets/svg/pen.svg";

type PopupReviewDisplayModeType = {
  setSubmitReviewMsg: React.Dispatch<
    React.SetStateAction<string | undefined | null>
  >;
  submitReviewMsg: string | undefined | null;
  errorGetReviewByOsmId: string | null | undefined;
};

const PopupReviewDisplayMode = ({
  submitReviewMsg,
  setSubmitReviewMsg,
  errorGetReviewByOsmId,
}: PopupReviewDisplayModeType) => {
  const { t } = useTranslation();
  const { reviews, setIsWriteMode, setEditingReview } = useReviewsStore();
  const averageRating = getAverageRating(reviews);
  const ratingCounts = getRatingCounts(reviews);
  const maxCount = Math.max(...Object.values(ratingCounts));
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [visible, setVisible] = useState(false); // submit success msg animation
  const [sortOption, setSortOption] = useState<"latest" | "likes">("latest");

  /**
   * Shrink average container
   */
  useEffect(() => {
    const reviewsEl = reviewsRef.current;
    if (!reviewsEl) return;
    const handleScroll = () => setIsShrunk(reviewsEl.scrollTop > 20); // 20px
    reviewsEl.addEventListener("scroll", handleScroll);
    return () => reviewsEl.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * submit msg timer
   */
  useEffect(() => {
    if (submitReviewMsg) {
      setVisible(true); // fade in
      const timer1 = setTimeout(() => setVisible(false), 10000); // fade out after 10s
      const timer2 = setTimeout(() => setSubmitReviewMsg(null), 10500); // remove from DOM  after 10.5s // remove after fade out - even after re-mount cpnt don't fade-in again
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [submitReviewMsg, setSubmitReviewMsg]);

  const writeHander = () => {
    setEditingReview(null);
    setIsWriteMode(true);
  };

  const sortedReviews = [...(reviews || [])].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
    }
    if (sortOption === "likes") {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  return (
    <Fragment>
      {errorGetReviewByOsmId ? (
        <div className="PopupReviewDisplayMode__err">
          <p className="PopupReviewDisplayMode__errMsg">
            {errorGetReviewByOsmId}
          </p>
          <Link
            to="/auth?mode=login"
            className="Button Button__inverted PopupReviewDisplayMode__errBtn"
          >
            {t("do-login")}
          </Link>
        </div>
      ) : (
        <div className="PopupReviewDisplayMode">
          <section
            className={`PopupReviewDisplayMode__averageContainer ${
              isShrunk ? "shrink" : ""
            }`}
          >
            <p className="PopupReviewDisplayMode__averageRating">
              {averageRating}
            </p>

            <div className="PopupReviewDisplayMode__chartContainer">
              {Object.entries(ratingCounts)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([rating, count]) => (
                  <div
                    className="PopupReviewDisplayMode__barContainer"
                    key={rating}
                  >
                    <div className="bar-row">
                      <div
                        className="bar"
                        style={{
                          width:
                            maxCount === 0
                              ? "0%"
                              : `${(count / maxCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section
            className="PopupReviewDisplayMode__scrollableContainer"
            ref={reviewsRef}
          >
            <div>
              <div className="PopupReviewDisplayMode__headerRow">
                <p className="PopupReviewDisplayMode__totalReviewNb">
                  {reviews?.length} {t("review")}
                </p>
                {sortedReviews.length > 0 && (
                  <div className="PopupReviewDisplayMode__sortButtons">
                    <button onClick={() => setSortOption("latest")}>
                      <DescriptionBox
                        text={t("latest")}
                        isInverted={sortOption === "latest"}
                      />
                    </button>
                    <button onClick={() => setSortOption("likes")}>
                      <DescriptionBox
                        text={t("most-liked")}
                        isInverted={sortOption === "likes"}
                      />
                    </button>
                  </div>
                )}
              </div>

              {submitReviewMsg && (
                <p
                  className={classNames("PopupReviewDisplayMode__successMsg", {
                    fadeIn: visible,
                    fadeOut: !visible,
                  })}
                >
                  {submitReviewMsg}
                </p>
              )}

              <ul>
                {sortedReviews.length > 0 ? (
                  sortedReviews.map((review) => (
                    <li
                      key={review.id}
                      className="PopupReviewDisplayMode__reviewItem"
                    >
                      <ReviewItem review={review} />
                    </li>
                  ))
                ) : (
                  <p className="PopupReviewDisplayMode__noReview">
                    {t("no-review")}
                  </p>
                )}
              </ul>
            </div>

            <button
              className="PopupReviewDisplayMode__Write"
              onClick={writeHander}
            >
              <SvgPen />
            </button>
          </section>
        </div>
      )}
    </Fragment>
  );
};
export default PopupReviewDisplayMode;
