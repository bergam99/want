import classNames from "classnames";
import "./Logo.css";
import { Link } from "react-router-dom";

type LogoType = {
  color?: "white" | "blue" | "black";
  size?: "xsmall" | "small" | "medium";
  noPadding?: boolean;
};

const Logo = ({
  color = "black",
  size = "medium",
  noPadding = false,
}: LogoType) => {
  const className = classNames("Logo", {
    Logo__noPadding: noPadding === true,
    Logo__white: color === "white",
    Logo__blue: color === "blue",
    Logo__xsmall: size === "xsmall",
    Logo__small: size === "small",
    Logo__medium: size === "medium",
  });
  return (
    <Link to="/">
      {size === "medium" ? (
        <h1 className={className}>Want</h1>
      ) : (
        <span className={className}>Want</span>
      )}
    </Link>
  );
};

export default Logo;
