import classNames from "classnames";
import "./CustomSelector.css";
import type { ReactNode } from "react";
import { amenityFormatter } from "../../utils";

type CustomSelectorType = {
  label?: string | ReactNode;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
  size?: "medium" | "large";
  isInverted?: boolean;
  disabled?: boolean;
};

const CustomSelector = ({
  label,
  value,
  onChange,
  options,
  size = "medium",
  isInverted,
  disabled,
}: CustomSelectorType) => {
  return (
    <div className={`CustomSelector__${size}`}>
      <label>{label}</label>
      <div
        className={classNames("CustomSelector__dropdown", {
          CustomSelector__dropdown__inverted: isInverted,
        })}
      >
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="CustomSelector__select"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {amenityFormatter(o)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomSelector;
