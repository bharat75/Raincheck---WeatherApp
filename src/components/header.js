import React from "react";
import logo from "../assets/weather-app.png";

const Header = () => {
  return (
    <div className="Header">
      <nav className="header-nav">
        <img src={logo} alt="Weather App" />
        <a href="#">RainCheck</a>
      </nav>
    </div>
  );
};

export default Header;
