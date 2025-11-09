import * as L from "leaflet";
import {
  MapContainer as LeafletMapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import CustomMarker from "./CustomMarker/CustomMarker";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import type { Area, FoundLocation } from "../mapData";
import "./MapContainer.css";
import PopupContent from "../PopupContent/PopupContent";
import MapContainerFilter from "./MapContainerFilter/MapContainerFilter";
import MarkerClusterGroup from "react-leaflet-markercluster";
import LayerSelector from "../LayerSelector/LayerSelector";

export const OSM = "OSM";
export const SAT = "Satellite";

type MapContainerType = {
  userLocation: [number, number] | null;
  mock_areas: Area[];
  foundLocations: FoundLocation[];
  setMapCenter: (center: [number, number]) => void;
  mapCenter: [number, number] | null;
  setUserMovedMap: Dispatch<SetStateAction<boolean>>;
};
/**
 * Control map's center
 */
const MapMover = ({ center }: { center: [number, number] }) => {
  const map = useMap(); // bring actual map instance

  // only everytime map's center change
  useEffect(() => {
    const currentCenter = map.getCenter();
    const newCenter = L.latLng(center[0], center[1]);

    if (!currentCenter.equals(newCenter)) {
      (map as any)._movedProgrammatically = true;
      map.setView(newCenter, map.getZoom());
    }
  }, [center, map]);

  return null; // render nothing on DOM
};

const MapEventHandler = ({
  onBoundsChanged,
  onUserMove,
}: {
  onBoundsChanged: (center: [number, number]) => void;
  onUserMove?: () => void;
}) => {
  const map = useMapEvents({
    moveend: (e) => {
      if ((map as any)._movedProgrammatically) {
        (map as any)._movedProgrammatically = false;
        return;
      }

      const center = e.target.getCenter();
      onBoundsChanged([center.lat, center.lng]);
      onUserMove?.();
    },
  });
  return null;
};

const MapContainer = ({
  userLocation,
  mock_areas,
  foundLocations,
  setMapCenter,
  mapCenter,
  setUserMovedMap,
}: MapContainerType) => {
  const [filters, setFilters] = useState({
    wheelchair: false,
    fee: false,
    opening_hours: false,
  });
  const [selectedLayer, setSelectedLayer] = useState<string>(OSM);
  const deniedBefore = localStorage.getItem("geoDenied");

  return (
    <Fragment>
      <section className="MapContainer__Map">
        <MapContainerFilter setFilters={setFilters} filters={filters} />
        <LayerSelector
          setSelectedLayer={setSelectedLayer}
          selectedLayer={selectedLayer}
        />
        <LeafletMapContainer
          center={userLocation || mock_areas[0].coordinates}
          zoom={13}
          scrollWheelZoom={false}
        >
          {selectedLayer === OSM && (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          )}
          {selectedLayer === SAT && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
            />
          )}
          {/* Track each map dragging and save in mapCenter */}
          <MapEventHandler
            onBoundsChanged={setMapCenter}
            onUserMove={() => setUserMovedMap(true)}
          />

          {/* Move map to new area */}
          <MapMover
            center={mapCenter || userLocation || mock_areas[0].coordinates}
          />

          {!!userLocation &&
            userLocation !== mock_areas[0].coordinates &&
            !deniedBefore && (
              <CustomMarker position={userLocation} userMarker />
            )}

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div class="cluster-icon">${count}</div>`,
                className: "custom-cluster-icon",
                iconSize: L.point(33, 33, true),
              });
            }}
          >
            {foundLocations
              .filter(({ lat, lon, tags }) => lat && lon && tags)
              .filter(({ tags }) => {
                if (filters.wheelchair && tags?.wheelchair !== "yes")
                  return false;
                if (filters.fee && tags?.fee !== "no") return false;
                if (filters.opening_hours && tags?.opening_hours !== "24/7")
                  return false;
                return true;
              })
              .map(({ id, lat, lon, tags }) => (
                // console.log({ foundLocations }),
                <CustomMarker key={id} position={[lat, lon]}>
                  <Popup>
                    <PopupContent tags={tags} lat={lat} lon={lon} osmId={id} />
                  </Popup>
                </CustomMarker>
              ))}
          </MarkerClusterGroup>
        </LeafletMapContainer>
      </section>
    </Fragment>
  );
};

export default MapContainer;
