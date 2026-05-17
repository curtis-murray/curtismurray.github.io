import PropTypes from "prop-types";
import * as Icon from "react-icons/fa";

const Navbar = ({ activeMenuId, menuItems }) => {
  return (
    <header className="lg:w-[660px] h-[144px] hidden lg:block p-[30px] ml-auto mb-10 rounded-[16px] bg-white dark:bg-dark-primary">
      <nav className="hidden lg:block">
        <ul className="flex">
          {menuItems.map((item, index) => {
            const ReactIcon = Icon[item.data.icon];
            return (
              <li key={index}>
                <a
                  className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center bg-light-bg-five text-[0.8125rem] font-medium text-text-primary dark:bg-dark-border dark:text-main-text transition-all duration-300 ease-in-out mx-2.5 rounded-[10px] ${
                    activeMenuId == item.data.link
                      ? "bg-gradient-to-r from-btn-primary to-gradient-to !text-white"
                      : "hover:bg-gradient-to-r hover:from-btn-primary hover:to-gradient-to hover:text-white hover:dark:text-white"
                  }`}
                  href={item.data.link}
                >
                  <span className="text-xl mb-1">
                    <ReactIcon />
                  </span>{" "}
                  {item.data.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

Navbar.propTypes = {
  activeMenuId: PropTypes.string,
  menuItems: PropTypes.array,
};

export default Navbar;
