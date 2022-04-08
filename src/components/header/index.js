import style from "./style.css";
// import logo from "./Rudimentary.svg";

import Lottie from "lottie-react";
import rudimentaryAnimation from "./rudimentary.json";

const logoStyle = {
  height: 200,
  width: 200,
};

const AnimatedLogo = () => {
  return <Lottie loop style={logoStyle} animationData={rudimentaryAnimation} />;
};

const Header = () => {
  return (
    <div className={style.header}>
      <AnimatedLogo />
      {/* <img src={logo} /> */}
    </div>
  );
};

export default Header;
