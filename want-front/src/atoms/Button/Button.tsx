import classNames from "classnames";
import "./Button.css";
import type { ReactNode } from "react";

type ButtonType = {
  buttonTxt: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "inverted" | "primary";
  type?: "submit" | "button";
};

const Button = ({
  buttonTxt,
  onClick,
  disabled,
  className,
  variant,
  type,
}: ButtonType) => {
  return (
    <button
      className={classNames("Button", className, {
        Button__disabled: disabled,
        Button__inverted: variant === "inverted",
        Button__primary: variant === "primary",
      })}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {buttonTxt}
    </button>
  );
};

export default Button;
