import classNames from "classnames";
import "./DescriptionBox.css";

type DescriptionBoxType = {
  text: string | null;
  isInverted?: boolean;
};

const DescriptionBox = ({ text, isInverted }: DescriptionBoxType) => {
  return (
    <p
      className={classNames("DescriptionBox", {
        DescriptionBox__inverted: isInverted,
      })}
    >
      {text}
    </p>
  );
};

export default DescriptionBox;
