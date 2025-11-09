import { Outlet } from "react-router-dom";
import Footer from "../../../atoms/Footer/Footer";
import Header from "../../../atoms/Header/Header";
import "./BasicLayout.css";

const BasicLayout = () => {
  return (
    <div className="BasicLayout">
      <Header />
      <div className="BasicLayout__main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default BasicLayout;
