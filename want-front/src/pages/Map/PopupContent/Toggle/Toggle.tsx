import classNames from "classnames";
import "./Toggle.css";
import DescriptionBox from "../../DescriptionBox/DescriptionBox";
import { useState } from "react";
import { useNotificationStore } from "../../../../store/notification";
import { useTranslation } from "react-i18next";
import SvgToggleArrow from "@/assets/svg/toggle_arrow.svg";

type ToggleType = {
  content: string[];
  title?: string;
  isNotifMode?: boolean;
};

const Toggle = ({ title, content, isNotifMode = false }: ToggleType) => {
  const [isOpen, setIsOpen] = useState(false);
  const { markAsRead, isRead } = useNotificationStore();
  const { t } = useTranslation();

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
    if (isNotifMode) {
      markAsRead();
    }
  };

  return (
    <div className="Toggle">
      <div onClick={handleToggleClick}>
        <p className="Toggle__btn">
          <span className="Toggle__titleWrapper">
            {title}
            {isNotifMode && !isRead && <span className="Toggle__dot">•</span>}
          </span>
          <span
            className={classNames("Toggle__arrow", {
              isOpen: isOpen,
            })}
          >
            <SvgToggleArrow />
          </span>
        </p>
      </div>

      <div className={classNames("Toggle__menu", { isOpen: isOpen })}>
        {content.map((c, i) => (
          <span key={i}>
            <DescriptionBox text={c} />
          </span>
        ))}
        {content.length === 0 && (
          <p className="Toggle__noNotif">{t("no-notifications")}</p>
        )}
      </div>
    </div>
  );
};

export default Toggle;
