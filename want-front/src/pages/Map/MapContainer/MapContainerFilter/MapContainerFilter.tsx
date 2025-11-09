import classNames from "classnames";
import { Fragment } from "react/jsx-runtime";
import DescriptionBox from "../../DescriptionBox/DescriptionBox";
import { useState } from "react";
import "./MapContainerFilter.css";
import { ReactComponent as SvgFilter } from "@/assets/svg/filter.svg";

type MapContainerFilterType = {
  filters: { wheelchair: boolean; fee: boolean; opening_hours: boolean };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      wheelchair: boolean;
      fee: boolean;
      opening_hours: boolean;
    }>
  >;
};

const MapContainerFilter = ({
  filters,
  setFilters,
}: MapContainerFilterType) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Inverted = isToggleOpen || Object.values(filters).some(Boolean);

  return (
    <Fragment>
      <button
        className={classNames("MapContainerFilter", {
          isInverted: Inverted,
        })}
        onClick={() => setIsToggleOpen(!isToggleOpen)}
      >
        <SvgFilter color={Inverted ? "white" : "black"} />
      </button>

      <div
        className={classNames("MapContainerFilter__items", {
          isOpen: isToggleOpen,
        })}
      >
        <button onClick={() => toggleFilter("wheelchair")}>
          <DescriptionBox text="Wheelchair" isInverted={!!filters.wheelchair} />
        </button>
        <button onClick={() => toggleFilter("fee")}>
          <DescriptionBox text="Free" isInverted={!!filters.fee} />
        </button>

        <button onClick={() => toggleFilter("opening_hours")}>
          <DescriptionBox
            text="Open 24/7"
            isInverted={!!filters.opening_hours}
          />
        </button>
      </div>
    </Fragment>
  );
};

export default MapContainerFilter;
