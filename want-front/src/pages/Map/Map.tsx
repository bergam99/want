import { useState, useEffect } from "react";
import "./Map.css";
import {
  mock_amenities,
  mock_areas,
  type Area,
  type FoundLocation,
} from "./mapData";

import Footer from "../../atoms/Footer/Footer";
import SearchBar from "./SearchBar/SearchBar";
import MapContainer from "./MapContainer/MapContainer";
import Loader from "../../atoms/Loader/Loader";
import Overlay from "./Overlay/Overlay";
import Slider from "../../atoms/Slider/Slider";
import Button from "../../atoms/Button/Button";
import axios from "axios";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

export default function Map() {
  const { t } = useTranslation();
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [amenity, setAmenity] = useState<string>(mock_amenities[0]);
  const [area, setSelectedArea] = useState<Area>(mock_areas[0]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    mock_areas[0].coordinates
  );
  const [foundLocations, setFoundLocations] = useState<FoundLocation[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [userMovedMap, setUserMovedMap] = useState(false);

  /**
   * Send query to osm via overpass api and get json
   *
   * don't use useRequest hook because Overpass API require specific format
   */
  const getOsmLocations = async (
    amenity: string,
    coordinates: [number, number]
  ) => {
    setMapCenter(coordinates);
    const radius = 5000; // 5km from coordinates
    const [lat, lon] = coordinates;
    const query = `
      [out:json];
      node[amenity=${amenity}](around:${radius},${lat},${lon}); 
      out body;
    `;
    setIsLayerVisible(false);

    setIsFetching(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        `data=${encodeURIComponent(query)}`, // encode body for x-www-form-urlencoded
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setFoundLocations(response.data.elements || []);
    } catch (error) {
      console.error("Overpass API fetch error:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const deniedBefore = localStorage.getItem("geoDenied");
    const savedCoords = localStorage.getItem("savedCoords");

    if (deniedBefore === "true" && savedCoords) {
      setIsLayerVisible(false);
      const parsedCoords = JSON.parse(savedCoords);
      setUserLocation(parsedCoords);
      getOsmLocations(mock_amenities[0], parsedCoords);
      return;
    }

    // request geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        getOsmLocations(mock_amenities[0], [latitude, longitude]);
      },
      // user denied geolocation
      (denied) => {
        if (denied.code === denied.PERMISSION_DENIED) {
          setIsLayerVisible(true);
          setIsFetching(false);
          localStorage.setItem("geoDenied", "true");
        }
      }
    );
  }, []);

  return (
    <>
      {isFetching && <Loader />}
      {isLayerVisible ? (
        <>
          <Overlay
            amenity={amenity}
            setAmenity={setAmenity}
            area={area}
            setSelectedArea={setSelectedArea}
            getOsmLocations={(amenity, coords) => {
              localStorage.setItem("savedCoords", JSON.stringify(coords));
              getOsmLocations(amenity, coords);
            }}
            isFetching={isFetching}
            mock_amenities={mock_amenities}
            mock_areas={mock_areas}
          />
        </>
      ) : (
        <div className="Map">
          <SearchBar
            amenity={amenity}
            setAmenity={setAmenity}
            area={area}
            setSelectedArea={setSelectedArea}
            isFetching={isFetching}
            mock_areas={mock_areas}
            mock_amenities={mock_amenities}
            getOsmLocations={getOsmLocations}
            error={error}
          />
          <Button
            buttonTxt={t("searchHere")}
            onClick={() => {
              getOsmLocations(amenity, mapCenter!);
              setUserMovedMap(false);
            }}
            className={classNames("Map__research", {
              show: userMovedMap && !!mapCenter,
            })}
          />
          <Slider />

          <MapContainer
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            userLocation={userLocation}
            mock_areas={mock_areas}
            foundLocations={foundLocations}
            setUserMovedMap={setUserMovedMap}
          />
          <Footer />
        </div>
      )}
    </>
  );
}
