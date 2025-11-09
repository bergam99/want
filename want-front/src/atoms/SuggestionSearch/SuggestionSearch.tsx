import { useState, type Dispatch, type SetStateAction } from "react";
import { mock_areas, type Area } from "../../pages/Map/mapData";
import "./SuggestionSearch.css";

type SuggestionSearchType = {
  searchList: Area[];
  setSelectedArea: Dispatch<SetStateAction<Area>>;
  label: string;
  area: Area;
  size?: "medium" | "large";
  disabled: boolean;
};

const SuggestionSearch = ({
  searchList,
  setSelectedArea,
  label,
  size = "medium",
  area,
  disabled,
}: SuggestionSearchType) => {
  const savedArea = () => {
    const savedCoords = localStorage.getItem("savedCoords");
    if (savedCoords) {
      const coords: [number, number] = JSON.parse(savedCoords);
      return (
        mock_areas.find(
          (a) =>
            a.coordinates[0] === coords[0] && a.coordinates[1] === coords[1]
        ) || area
      );
    }
  };

  const initialArea = savedArea();
  const isUserPosition = localStorage.getItem("geoDenied") !== "true";

  const [query, setQuery] = useState(
    isUserPosition ? "My Position" : initialArea?.city || ""
  );
  const [suggestions, setSuggestions] = useState<Area[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = window.setTimeout(() => {
      handleSearch(value);
    }, 300);
    setTypingTimeout(timeout);
  };

  const handleSearch = (text: string) => {
    if (!text) {
      setSuggestions(searchList);
      return;
    }
    const filtered = searchList.filter((item) =>
      item.city.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSelect = (selected: Area) => {
    setQuery(selected.city);
    setSelectedArea(selected);
    setSuggestions([]);
  };

  const handleFocus = () => {
    setSuggestions(searchList);
  };

  const handleMouseLeave = () => {
    setSuggestions([]);
  };

  return (
    <div className={`SuggestionSearch__${size}`}>
      <p className="SuggestionSearch__label">{label}</p>
      <div className="">
        <input
          className="SuggestionSearch__input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
        />

        {suggestions.length > 0 && (
          <ul
            className="SuggestionSearch__dropdown"
            onMouseLeave={handleMouseLeave}
          >
            {suggestions.map((s, idx) => (
              <li key={idx} onClick={() => handleSelect(s)}>
                {s.city}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SuggestionSearch;
