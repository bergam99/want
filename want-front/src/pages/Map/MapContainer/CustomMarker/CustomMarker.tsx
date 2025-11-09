import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet";

type CustomMarkerType = {
  position: [number, number];
  children?: React.ReactNode;
  userMarker?: boolean;
};

const CustomMarker = ({
  position,
  children,
  userMarker = false,
}: CustomMarkerType) => {
  const iconUrl = userMarker
    ? CustomMapMarker("#ff6347")
    : CustomMapMarker("black");

  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [33, 33],
    iconAnchor: [16.5, 16.5],
  });
  return (
    <Marker position={position} icon={customIcon}>
      {children}
    </Marker>
  );
};

export default CustomMarker;

const CustomMapMarker = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
        <circle cx="16.5" cy="16.5" r="16" fill="${fill}" stroke="black" strokeWidth="1"/>
      </svg>
    `)}`;
