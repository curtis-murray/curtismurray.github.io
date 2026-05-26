import PropTypes from "prop-types";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import PortfolioCard from "./PortfolioCard";
import { useEffect, useRef, useState } from "react";

const PortfolioContent = ({ portfolio, filters }) => {
  const isotopeRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("*");

  useEffect(() => {
    // Initialize Isotope after component mounts
    const grid = document.querySelector(".portfolio_list-two");

    // Initialize Isotope
    isotopeRef.current = new Isotope(grid, {
      itemSelector: ".portfolio_list-two-items",
      percentPosition: true,
      masonry: {
        columnWidth: ".grid-sizer",
      },
    });

    // Wait for images to load before initializing Isotope
    imagesLoaded(grid).on("progress", () => {
      isotopeRef.current.layout();
    });

    return () => {
      // Clean up Isotope instance when component unmounts
      isotopeRef.current.destroy();
    };
  }, []);

  const handleFilter = (filterValue) => {
    isotopeRef.current.arrange({ filter: filterValue });
    setActiveFilter(filterValue);
  };
  return (
    <div className="mb-4">
      <ul className="button-group isotop-menu-wrapper mb-8 flex w-full justify-start flex-wrap font-medium gap-x-6 gap-y-2">
        {filters.map((filter, index) => (
          <li
            key={index}
            className={`cursor-pointer transition-colors duration-300 ease-in-out hover:text-primary fillter-btn ${
              filter.data.tag == activeFilter
                ? "text-primary"
                : "text-base-content/70"
            }`}
            data-filter={filter.data.tag}
            onClick={() => handleFilter(filter.data.tag)}
          >
            {filter.data.name}
          </li>
        ))}
      </ul>

      <div id="isotop-gallery-wrapper" className="portfolio_list-two two-col">
        <div className="grid-sizer w-[50%] px-[10px] py-[10px]"></div>
        {portfolio.map((item, index) => (
          <div
            key={index}
            className={`portfolio_list-two-items isotop-details ${item.data.tag} mb-5 w-full md:w-[48%]`}
          >
            <PortfolioCard details={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

PortfolioContent.propTypes = {
  portfolio: PropTypes.array,
  filters: PropTypes.array,
};

export default PortfolioContent;
