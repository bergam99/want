import { useEffect, useState } from "react";
import classNames from "classnames";
import "./FailedPopup.css";

const FailedPopup = ({ p }: { p: string | null | undefined }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (p) {
      setVisible(true);
      const timer1 = setTimeout(() => setVisible(false), 5000);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [p]);

  return (
    <>
      {p && (
        <p
          className={classNames("FailedPopup", {
            fadeIn: visible,
            fadeOut: !visible,
          })}
        >
          {p}
        </p>
      )}
    </>
  );
};

export default FailedPopup;
