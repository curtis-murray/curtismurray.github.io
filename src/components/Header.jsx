import { useEffect, useState } from "react";
import darkLogo from "/assets/logo/dark-logo.png";
import lightLogo from "/assets/logo/light-logo.png";
import PropTypes from "prop-types";
import { themeToggler } from "../js/script";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import * as Icon from "react-icons/fa";

const Header = ({ activeMenuId, menuItems }) => {
  const [showMenu, setShowMenu] = useState(false);
  const mobileMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    themeToggler();
  }, []);

  return (
    <>
      <div className="container flex w-full justify-between bg-light-bg-five dark:bg-black py-5 mr-auto ml-auto lg:bg-transparent lg:pl-0 lg:pr-0 lg:pt-[50px] lg:dark:bg-transparent">
        <div className="w-full flex justify-between items-center px-4">
          <a href="/">
            <img
              className="logo lightLogo h-[0px] lg:h-[0px] hidden"
              src={lightLogo}
              alt="logo"
            />
            <img
              className="logo darkLogo h-[0px] lg:h-[0px] hidden"
              src={darkLogo}
              alt="logo"
            />
            <h3 className="mt-6 mb-1 font-semibold dark:text-white lg:hidden">
              Curtis Murray
            </h3>
            
          </a>
          <div className="flex items-center">
            <button
              id="theme-toggle"
              aria-label="Theme toggler"
              type="button"
              className="flex h-[40px] w-[40px] lg:w-[50px] lg:h-[50px] cursor-pointer items-center justify-center rounded-full bg-opacity-100 text-opacity-100 text-black transition-all duration-300 ease-in-out hover:bg-modal-text hover:text-white bg-white dark:bg-dark-bg-three dark:text-white"
            >
              <span id="theme-toggle-light-icon" className="hidden">
                <FaMoon className="text-xl" />
              </span>
              <span id="theme-toggle-dark-icon" className="hidden">
                <FaSun className="text-xl" />
              </span>
            </button>
            <button
              id="menu-toggle"
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center bg-[white] text-[black] hover:bg-modal-text hover:text-white hover:dark:text-white transition-all duration-300 ease-in-out ml-3 rounded-full dark:text-black lg:hidden"
              onClick={mobileMenuToggle}
              aria-label="Mobile Menu Togglers"
            >
              {showMenu ? (
                <ImCross id="menu-toggle-close-icon" className="text-xl" />
              ) : (
                  <FaBars id="menu-toggle-open-icon" className="text-xl" />
                )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <nav id="navbar" className={`${showMenu ? "" : "hidden"} lg:hidden`}>
        <ul className="block rounded-b-[20px] shadow-md absolute left-0 top-20 z-[22222222222222] w-full bg-white dark:bg-dark-mobile-primary">
          {menuItems.map((item, index) => {
            const ReactIcon = Icon[item.data.icon];
            return (
              <li key={index}>
                <a
                  className={`flex cursor-pointer items-center pt-[0.625rem] pb-[0.625rem] pl-4 pr-1 xl:pl-5 xl:pr-5 font-poppins font-sans text-xs font-medium text-text-primary dark:text-white hover:text-btn-primary  transition-all duration-300 ease-in-out ${
activeMenuId == item.data.link ? "!text-btn-primary" : ""
}`}
                  href={item.data.link}
                >
                  <span className="mr-2 text-xl">
                    <ReactIcon />
                  </span>
                  {item.data.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

Header.propTypes = {
  activeMenuId: PropTypes.string,
  menuItems: PropTypes.array,
};

export default Header;
