import { useEffect } from "react";
import Button from "../../../atoms/Button/Button";
import CustomSelector from "../../../atoms/CustomSelector/CustomSelector";
import Logo from "../../../atoms/Logo/Logo";
import type { Area } from "../mapData";
import "./SearchBar.css";
import { ReactComponent as SvgArrowRight } from "@/assets/svg/arrow-right.svg";
import SuggestionSearch from "../../../atoms/SuggestionSearch/SuggestionSearch";
import FailedPopup from "../FailedPopup/FailedPopup";

type SearchBarType = {
  amenity: string;
  mock_amenities: string[];
  mock_areas: Area[];
  setAmenity: React.Dispatch<React.SetStateAction<string>>;
  area: Area;
  setSelectedArea: React.Dispatch<React.SetStateAction<Area>>;
  isFetching: boolean;
  getOsmLocations: (amenity: string, coordinates: [number, number]) => void;
  error?: string | null;
};
const SearchBar = ({
  amenity,
  mock_amenities,
  setAmenity,
  mock_areas,
  area,
  setSelectedArea,
  isFetching,
  getOsmLocations,
  error,
}: SearchBarType) => {
  useEffect(() => {
    const savedCoords = localStorage.getItem("savedCoords");
    if (savedCoords) {
      const parsed = JSON.parse(savedCoords);
      const foundArea =
        mock_areas.find(
          (a) =>
            a.coordinates[0] === parsed[0] && a.coordinates[1] === parsed[1]
        ) || mock_areas[0];
      setSelectedArea(foundArea);
    }
  }, [mock_areas, setSelectedArea]);
  return (
    <div className="SearchBar">
      <CustomSelector
        label={<Logo size="medium" noPadding />}
        value={amenity}
        onChange={(e) => setAmenity(e.target.value)}
        options={mock_amenities}
        disabled={isFetching}
      />
      <SuggestionSearch
        searchList={mock_areas}
        setSelectedArea={setSelectedArea}
        label="in "
        size="medium"
        area={area}
        disabled={isFetching}
      />
      <Button
        onClick={() => {
          localStorage.setItem("savedCoords", JSON.stringify(area.coordinates));
          getOsmLocations(amenity, area.coordinates);
        }}
        disabled={isFetching}
        className="SearchBar__button"
        buttonTxt={<SvgArrowRight />}
      />
      <FailedPopup p={error} />
    </div>
  );
};

export default SearchBar;
