import { Link } from "react-router-dom";
import { generateMapLink } from "../../../../utils";
import "./TrajetLink.css";
import { useTranslation } from "react-i18next";
import { ReactComponent as SvgAppleMap } from "@/assets/svg/applemap.svg";
import { ReactComponent as SvgGoogleMap } from "@/assets/svg/googlemap.svg";

type TrajetLinkType = {
  lat: number;
  lon: number;
};

const TrajetLink = ({ lat, lon }: TrajetLinkType) => {
  const { t } = useTranslation();

  return (
    <div className="TrajetLink">
      <div className="TrajetLink__linkWrapper">
        <SvgGoogleMap />
        <Link
          to={generateMapLink("google", lat, lon)}
          target="_blank"
          rel="noreferrer"
          className="TrajetLink__link"
        >
          {t("gmap")}
        </Link>
      </div>
      <div className="TrajetLink__linkWrapper">
        <SvgAppleMap />
        <Link
          to={generateMapLink("apple", lat, lon)}
          target="_blank"
          rel="noreferrer"
          className="TrajetLink__link"
        >
          {t("amap")}
        </Link>
      </div>
    </div>
  );
};

export default TrajetLink;
