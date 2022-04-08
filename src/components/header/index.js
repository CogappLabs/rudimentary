import style from "./style.css";
import logo from "./Rudimentary.svg";

const Header = () => {
  return (
    <div className={style.header}>
      <img src={logo} />
    </div>
  );
};

export default Header;
