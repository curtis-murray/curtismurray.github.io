import PropTypes from "prop-types";
import { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { themeToggler } from "../js/script";

// Slim, transparent desktop top bar shared by every route — sits over the
// mountain backdrop. Wordmark left, text links + theme toggle right. Carries
// view-transition-name vt-nav so it stays put across page navigations.
const StoryNav = ({ activeMenuId, menuItems, name = "Curtis Murray" }) => {
  useEffect(() => {
    themeToggler();
  }, []);

  return (
    <header className="[view-transition-name:vt-nav] hidden lg:flex sticky top-0 z-50 items-center justify-between px-10 xl:px-16 py-6 backdrop-blur-[2px]">
      <a
        href="/"
        className="text-lg font-semibold tracking-tight text-base-content hover:text-primary transition-colors"
      >
        {name}
      </a>
      <nav className="flex items-center gap-6">
        <ul className="flex items-center gap-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.data.link}
                className={`text-sm font-medium lowercase transition-colors ${
                  activeMenuId == item.data.link
                    ? "text-primary"
                    : "text-base-content/70 hover:text-primary"
                }`}
              >
                {item.data.name}
              </a>
            </li>
          ))}
        </ul>
        <button
          data-theme-toggle
          aria-label="Toggle theme"
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-base-content/80 hover:text-primary hover:bg-base-200/60 transition-all"
        >
          <span className="icon-to-dark">
            <FaMoon className="text-lg" />
          </span>
          <span className="icon-to-light">
            <FaSun className="text-lg" />
          </span>
        </button>
      </nav>
    </header>
  );
};

StoryNav.propTypes = {
  activeMenuId: PropTypes.string,
  menuItems: PropTypes.array,
  name: PropTypes.string,
};

export default StoryNav;
