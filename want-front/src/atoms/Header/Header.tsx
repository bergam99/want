import Logo from "../Logo/Logo";
import Slider from "../Slider/Slider";
import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <Logo noPadding />
      <Slider />
    </div>
  );
};

export default Header;
