import "./Dashboard.css";
import { useLoaderData } from "react-router";
import TierProgressBar from "./TierProgressBar/TierProgressBar";
import type { ReviewsType } from "../../store/reviews";
import { useNotificationStore } from "../../store/notification";
import ToggleDescription from "../Map/PopupContent/Toggle/Toggle";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const myReviews = useLoaderData() as ReviewsType;
  const { notifications } = useNotificationStore();
  const { t } = useTranslation();

  return (
    <div className="Dashboard">
      <TierProgressBar reviews={myReviews} key={notifications.length} />

      <ToggleDescription
        title={t("notifications")}
        content={notifications}
        isNotifMode
      />

      {/* {myReviews.length > 0 ? (
        <ul className="Dashboard__reviewContainer">
          {myReviews.map((review) => (
            <li key={review.id} className="Dashboard__container">
              <ReviewItem review={review} isDisplayMode />
            </li>
          ))}
        </ul>
      ) : (
        <p>no review yet</p>
      )} */}
    </div>
  );
};

export default Dashboard;
