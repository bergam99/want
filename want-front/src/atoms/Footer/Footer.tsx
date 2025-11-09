import { Link } from "react-router-dom";

import "./Footer.css";
import Logo from "../Logo/Logo";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="Footer">
      <p className="Footer__txt">
        <Link to="/about">{t("legal")}</Link>
      </p>
      <p className="Footer__copy">
        <span className="Footer__copyTxt">© 2025</span>{" "}
        <Logo size="xsmall" noPadding />
      </p>
    </footer>
  );
};

export default Footer;
