import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { themeToggler } from "../js/script";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import * as Icon from "react-icons/fa";

// Mobile top bar (lg:hidden). Wordmark + theme toggle + hamburger menu.
// Desktop chrome is handled by StoryNav.
const Header = ({ activeMenuId, menuItems }) => {
  const [showMenu, setShowMenu] = useState(false);
  const mobileMenuToggle = () => setShowMenu(!showMenu);

  useEffect(() => {
    themeToggler();
  }, []);

  return (
    <div className="lg:hidden">
      <div className="container flex w-full justify-between py-5 mr-auto ml-auto">
        <div className="w-full flex justify-between items-center px-4">
          <a href="/">
            <h3 className="font-semibold text-base-content">Curtis Murray</h3>
          </a>
          <div className="flex items-center">
            <button
              data-theme-toggle
              aria-label="Toggle theme"
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base-content/80 bg-base-200/70 hover:bg-primary hover:text-primary-content transition-all duration-300 ease-in-out"
            >
              <span className="icon-to-dark">
                <FaMoon className="text-lg" />
              </span>
              <span className="icon-to-light">
                <FaSun className="text-lg" />
              </span>
            </button>
            <button
              id="menu-toggle"
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center bg-base-200/70 text-base-content hover:bg-primary hover:text-primary-content transition-all duration-300 ease-in-out ml-3 rounded-full"
              onClick={mobileMenuToggle}
              aria-label="Mobile menu toggle"
            >
              {showMenu ? (
                <ImCross className="text-base" />
              ) : (
                <FaBars className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <nav className={`${showMenu ? "" : "hidden"}`}>
        <ul className="block rounded-b-[20px] shadow-lg absolute left-0 top-20 z-[999] w-full bg-base-100/95 backdrop-blur-md">
          {menuItems.map((item, index) => {
            const ReactIcon = Icon[item.data.icon];
            return (
              <li key={index}>
                <a
                  className={`flex cursor-pointer items-center py-3 px-5 font-medium text-sm lowercase transition-all duration-300 ease-in-out ${
                    activeMenuId == item.data.link
                      ? "text-primary"
                      : "text-base-content hover:text-primary"
                  }`}
                  href={item.data.link}
                >
                  <span className="mr-3 text-lg">{ReactIcon && <ReactIcon />}</span>
                  {item.data.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

Header.propTypes = {
  activeMenuId: PropTypes.string,
  menuItems: PropTypes.array,
};

export default Header;
