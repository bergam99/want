import { useState } from "react";
import CustomSelector from "../../../atoms/CustomSelector/CustomSelector";
import type { Area } from "../mapData";
import "./Overlay.css";
import Button from "../../../atoms/Button/Button";
import { ReactComponent as SvgArrowRight } from "@/assets/svg/arrow-right.svg";
import SuggestionSearch from "../../../atoms/SuggestionSearch/SuggestionSearch";

type OverlayType = {
  amenity: string;
  setAmenity: React.Dispatch<React.SetStateAction<string>>;
  area: Area;
  setSelectedArea: React.Dispatch<React.SetStateAction<Area>>;
  isFetching: boolean;
  mock_areas: Area[];
  mock_amenities: string[];
  getOsmLocations: (amenity: string, coordinates: [number, number]) => void;
};

const Overlay = ({
  amenity,
  setAmenity,
  area,
  setSelectedArea,
  isFetching,
  mock_areas,
  mock_amenities,
  getOsmLocations,
}: OverlayType) => {
  const [step, setStep] = useState(1);

  return (
    <div className="Overlay">
      {step === 1 && (
        <div className="Overlay__layer">
          <CustomSelector
            isInverted
            label="Want "
            size="large"
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            options={mock_amenities}
          />
          <Button
            className="Overlay__arrow"
            onClick={() => setStep(2)}
            buttonTxt={<SvgArrowRight />}
          />
        </div>
      )}
      {step === 2 && (
        <div className="Overlay__layer">
          <SuggestionSearch
            searchList={mock_areas}
            setSelectedArea={setSelectedArea}
            label="in "
            area={area}
            size="large"
            disabled={isFetching}
          />

          <Button
            onClick={() => {
              localStorage.setItem(
                "savedCoords",
                JSON.stringify(area.coordinates)
              );
              getOsmLocations(amenity, area.coordinates);
            }}
            disabled={isFetching}
            className="Overlay__arrow"
            buttonTxt={<SvgArrowRight />}
          />
        </div>
      )}
    </div>
  );
};

export default Overlay;
