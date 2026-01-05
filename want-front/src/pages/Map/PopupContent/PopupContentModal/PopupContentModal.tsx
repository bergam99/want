import "./PopupContentModal.css";
import PopupReviewWriteMode from "./PopupReviewWriteMode/PopupReviewWriteMode";
import PopupReviewDisplayMode from "./PopupReviewDisplayMode/PopupReviewDisplayMode";
import { useState } from "react";
import { useReviewsStore } from "../../../../store/reviews";

type PopupContentModalType = {
  osmId: number;
  errorGetReviewByOsmId: string | null | undefined;
};

const PopupContentModal = ({
  errorGetReviewByOsmId,
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
          osmId={osmId}
          setSubmitReviewMsg={setSubmitReviewMsg}
        />
      )}
    </div>
  );
};

export default PopupContentModal;
