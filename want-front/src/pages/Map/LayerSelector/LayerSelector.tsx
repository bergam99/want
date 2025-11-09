import { Fragment, type Dispatch, type SetStateAction } from "react";
import { OSM, SAT } from "../MapContainer/MapContainer";
import "./LayerSelector.css";
import classNames from "classnames";
import { ReactComponent as SvgSatellite } from "@/assets/svg/satellite.svg";

type LayerSelectorType = {
  selectedLayer: string;
  setSelectedLayer: Dispatch<SetStateAction<string>>;
};

const LayerSelector = ({
  selectedLayer,
  setSelectedLayer,
}: LayerSelectorType) => {
  const toggleLayer = () => {
    setSelectedLayer(selectedLayer === OSM ? SAT : OSM);
  };

  return (
    <Fragment>
      <button
        className={classNames("LayerSelector", {
          isInverted: selectedLayer === SAT,
        })}
        onClick={toggleLayer}
      >
        <SvgSatellite color={selectedLayer === SAT ? "white" : "black"} />
      </button>
    </Fragment>
  );
};

export default LayerSelector;
