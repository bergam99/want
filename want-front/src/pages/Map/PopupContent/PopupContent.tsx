import { useRef, useState } from "react";
import "./PopupContent.css";
import Button from "../../../atoms/Button/Button";
import Modal, { type ModalHandlersType } from "../../../atoms/Modal/Modal";

import TrajetLink from "./TrajetLink/TrajetLink";
import { useRouteLoaderData } from "react-router-dom";
import ToggleDescription from "./Toggle/Toggle";
import PopupContentModal from "./PopupContentModal/PopupContentModal";
import { useReviewsStore } from "../../../store/reviews";
import {
  amenityFormatter,
  getAccessDescription,
  getToiletDescription,
} from "../../../utils";
import { useTranslation } from "react-i18next";

type PopupContentType = {
  tags: any;
  lat: number;
  lon: number;
  osmId: number;
};

const PopupContent = ({ tags, lat, lon, osmId }: PopupContentType) => {
  const { t } = useTranslation();
  const dialog = useRef<ModalHandlersType>(null); // reach out to modal (forwardRef)
  const token = useRouteLoaderData("root") as string | null;
  const { getReviewsByOsmId } = useReviewsStore();
  const [error, setError] = useState<string | undefined | null>();
  const {
    fee,
    wheelchair,
    access,
    level,
    operator,
    female,
    male,
    description,
    unisex,
    opening_hours,
    name,
    alt_name,
    amenity,
    cold_water,
    hot_water,
    dog,
  } = tags;

  const toiletDescription = getToiletDescription(female, male, unisex);
  const accessDescription = getAccessDescription(access);

  const getDescriptions: any = [
    description ? `${description}` : null,
    toiletDescription ? `${toiletDescription}` : null,
    fee === "yes" ? "A fee might apply" : null,
    fee === "no" ? "Free" : null,
    wheelchair === "yes" ? "Accessible with wheelchair" : null,
    level ? `${level}th floor` : null,
    cold_water === "yes" ? "Cold water available" : null,
    hot_water === "yes" ? "Hot water available" : null,
    dog === "designated" ? "Animal friendly" : null,
    opening_hours ? `Opening hour: ${opening_hours}` : null,
    operator ? `Operated by ${operator}` : null,
    accessDescription ? `${accessDescription}` : null,
  ].filter(Boolean);

  /**
   * handleModalOpen
   */
  const handleModalOpen = async (osmId: number) => {
    const result = await getReviewsByOsmId(osmId, token);
    if (!result?.isSuccess) {
      setError(result?.message);
    } else {
      setError(null);
    }
    dialog.current?.open();
  };

  return (
    <div className="PopupContent">
      {(name || alt_name || amenity) && (
        <p className="PopupContent__title">
          {name || alt_name || amenityFormatter(amenity)}
        </p>
      )}

      <Modal ref={dialog}>
        <PopupContentModal
          amenity={amenity}
          osmId={osmId}
          errorGetReviewByOsmId={error}
        />
      </Modal>
      <TrajetLink lat={lat} lon={lon} />
      {getDescriptions.length > 0 && (
        <ToggleDescription content={getDescriptions} />
      )}

      <Button
        variant="inverted"
        className="PopupContent__button2"
        buttonTxt={t("review")}
        onClick={() => {
          handleModalOpen(osmId);
        }}
      />
    </div>
  );
};
export default PopupContent;
