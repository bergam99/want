import { useEffect, useState, type JSX } from "react";
import "./Slider.css";
import { Form, Link, NavLink, useRouteLoaderData } from "react-router-dom";
import classNames from "classnames";
import { jwtDecoder } from "../../pages/Auth/Auth_utils";
import { useNotificationStore } from "../../store/notification";
import { emailFormatter } from "../../utils";
import CustomSelector from "../CustomSelector/CustomSelector";
import { useTranslation } from "react-i18next";
import { LANG } from "../../i18n";
import SvgMenuBurger from "@/assets/svg/menuburger.svg";
import SvgBurgerClose from "@/assets/svg/close.svg";

const Slider = () => {
  const { getNotifications } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const token = useRouteLoaderData("root") as string | null;
  const decodedToken = jwtDecoder(token);
  const userEmail = decodedToken?.sub;
  const { isRead } = useNotificationStore();
  const [lang, setLang] = useState("en");
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();
    if (!token) return;

    getNotifications(token, controller);

    return () => {
      controller.abort(); // unmount clean up
    };
  }, [getNotifications, token]);

  type navType = {
    to: string;
    visible: boolean;
    classBase?: string;
    activeClass: string;
    content: JSX.Element | string;
    isForm?: boolean;
  }[];
  const nav: navType = [
    {
      to: "/",
      visible: true,
      classBase: "Slider__navItem",
      activeClass: "Slider__navItemActive",
      content: <p>{t("map")}</p>,
    },
    {
      to: "/auth?mode=login",
      visible: !token,
      classBase: "Slider__auth",
      activeClass: "Slider__authActive",
      content: <p>{t("login")}</p>,
    },
    {
      to: "/dashboard",
      visible: !!token,
      classBase: "Slider__navItem",
      activeClass: "Slider__navItemActive",
      content: (
        <>
          <span className="Slider__dashboard">
            {t("dashboard")}{" "}
            {!isRead && <span className="Slider__notifNav">•</span>}
          </span>
        </>
      ),
    },
    {
      to: "/scoreboard",
      visible: !!token,
      classBase: "Slider__navItem",
      activeClass: "Slider__navItemActive",
      content: t("scoreboard"),
    },
    {
      to: "/about",
      visible: true,
      classBase: "Slider__navItem",
      activeClass: "Slider__navItemActive",
      content: <p>{t("legal")}</p>,
    },
    {
      isForm: true,
      to: "/logout",
      visible: !!token,
      activeClass: "",
      content: (
        <>
          <Form action="/logout" method="post" className="Slider__logout">
            <button>{t("logout")}</button>
          </Form>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        className={`Slider__background ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="Slider__buttonWrapper">
        <button className="Slider__button" onClick={() => setIsOpen(!isOpen)}>
          {!isOpen && <SvgMenuBurger />}
          {isOpen && <SvgBurgerClose />}
          {!isRead && <p className="Slider__notif">•</p>}
        </button>
      </div>

      <nav className={`Slider__menu ${isOpen ? "open" : ""}`}>
        <ul className="Slider__navs">
          {nav
            .filter((li) => li.visible)
            .map(({ isForm, to, classBase, activeClass, content }) => {
              if (isForm) return <li key={to}>{content}</li>;

              return (
                <li
                  className="Slider__li"
                  key={to}
                  onClick={() => setIsOpen(false)}
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      classNames(classBase, {
                        [activeClass]: isActive,
                      })
                    }
                  >
                    {content}
                  </NavLink>
                </li>
              );
            })}
        </ul>
        <div className="Slider__CustomSelectorWrapper">
          <CustomSelector
            size="medium"
            value={lang.toUpperCase()}
            options={LANG.map((l) => l.toUpperCase())}
            onChange={(e) => {
              const newLang =
                LANG.find((l) => l === e.target.value.toLowerCase()) || LANG[0];
              setLang(newLang);
              i18n.changeLanguage(newLang);
            }}
          />
        </div>
        <div className="Slider__user">
          {userEmail ? (
            <p>
              {t("hello")}, {emailFormatter(userEmail)}
            </p>
          ) : (
            <p>
              <Link
                to="/auth?mode=login"
                className="Slider__userLink Button__inverted"
              >
                <span>{t("login")}</span>
              </Link>
            </p>
          )}
        </div>
      </nav>
    </>
  );
};

export default Slider;
