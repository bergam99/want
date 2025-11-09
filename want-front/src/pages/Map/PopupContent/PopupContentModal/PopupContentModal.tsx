import "./PopupContentModal.css";
import PopupReviewWriteMode from "./PopupReviewWriteMode/PopupReviewWriteMode";
import PopupReviewDisplayMode from "./PopupReviewDisplayMode/PopupReviewDisplayMode";
import { useState } from "react";
import { useReviewsStore } from "../../../../store/reviews";

type PopupContentModalType = {
  amenity: string;
  osmId: number;
  errorGetReviewByOsmId: string | null | undefined;
};

const PopupContentModal = ({
  errorGetReviewByOsmId,
  amenity,
  osmId,
}: PopupContentModalType) => {
  const { isWriteMode } = useReviewsStore();
  const [submitReviewMsg, setSubmitReviewMsg] = useState<
    string | undefined | null
  >();

  return (
    <div className="PopupContentModal">
      {!isWriteMode ? (
        <PopupReviewDisplayMode
          submitReviewMsg={submitReviewMsg}
          setSubmitReviewMsg={setSubmitReviewMsg}
          errorGetReviewByOsmId={errorGetReviewByOsmId}
        />
      ) : (
        <PopupReviewWriteMode
          amenity={amenity}
          osmId={osmId}
          setSubmitReviewMsg={setSubmitReviewMsg}
        />
      )}
    </div>
  );
};

export default PopupContentModal;
