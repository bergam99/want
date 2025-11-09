import { Fragment } from "react/jsx-runtime";
import "./StarRating.css";
import type { UseFormRegisterReturn } from "react-hook-form";
import SvgStar from "@/assets/svg/star.svg";

type StarRatingType = {
  hovered: number | null;
  selected: number;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  setSelected: (val: number) => void;
  register: UseFormRegisterReturn<"rating">;
};

const StarRating = ({
  hovered,
  selected,
  setHovered,
  setSelected,
  register,
}: StarRatingType) => {
  return (
    <Fragment>
      <div className="PopupReviewForm__starsContainer">
        <input type="hidden" id="rating" value={selected} {...register} />

        {Array.from({ length: 5 }, (_, i) => {
          // repeat on 0,1,2,3,4
          const value = i + 1;
          // if user hover then fill until hovered area, if not until selected area
          const isFilled =
            hovered !== null ? value <= hovered : value <= selected;

          return (
            <div
              key={value}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(value)}
            >
              <SvgStar color={isFilled ? "#000000" : "#dddddd"} />
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default StarRating;
