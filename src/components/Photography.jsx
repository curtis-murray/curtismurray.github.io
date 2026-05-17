import PropTypes from "prop-types";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Photography = ({ photos }) => {
  const isotopeRef = useRef(null);
  const gridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    isotopeRef.current = new Isotope(grid, {
      itemSelector: ".photo-item",
      percentPosition: true,
      masonry: {
        columnWidth: ".grid-sizer",
        gutter: 0,
      },
    });

    const imgLoad = imagesLoaded(grid);
    imgLoad.on("progress", () => {
      isotopeRef.current && isotopeRef.current.layout();
    });

    const handleResize = () => {
      isotopeRef.current && isotopeRef.current.layout();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
        isotopeRef.current = null;
      }
    };
  }, [photos]);

  const openLightbox = (index) => setActiveIndex(index);
  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    },
    [photos.length]
  );
  const showNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
    },
    [photos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  return (
    <div className="container mr-auto ml-auto mb-8 px-4 sm:px-5 md:px-10 lg:px-[60px]">
      <div className="py-12">
        <h2 className="relative inline-block text-[2.5rem] dark:text-white font-bold transform after:absolute after:md:w-[12rem] after:left-[16rem] after:h-0.5 after:bg-gradient-to-r after:from-btn-secondary after:to-btn-secondary after:content-[''] after:rounded-md after:top-2/4 after:transform">
          Photography
        </h2>
      </div>

      <div ref={gridRef} className="photography-grid -mx-1.5">
        <div className="grid-sizer w-full sm:w-1/2 lg:w-1/3"></div>
        {photos.map((photo, index) => (
          <div
            key={photo.file}
            className="photo-item w-full sm:w-1/2 lg:w-1/3 px-1.5 mb-3"
          >
            <button
              type="button"
              onClick={() => openLightbox(index)}
              className="block w-full overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-btn-primary"
              aria-label="Open photo"
            >
              <img
                src={`/assets/photography/thumbs/${photo.file}`}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                alt=""
                className="block w-full h-auto rounded-lg transition duration-300 ease-in-out transform group-hover:scale-105"
              />
            </button>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition"
          >
            <FaTimes />
          </button>
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous"
            className="absolute left-2 md:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next"
            className="absolute right-2 md:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition"
          >
            <FaChevronRight />
          </button>
          <img
            src={`/assets/photography/large/${photos[activeIndex].file}`}
            alt=""
            className="max-h-[90vh] max-w-[92vw] object-contain rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

Photography.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.string.isRequired,
      width: PropTypes.number,
      height: PropTypes.number,
    })
  ).isRequired,
};

export default Photography;
