import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "./Modal";

const PortfolioCard = ({ details }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className="rounded-xl bg-base-200/60 ring-1 ring-base-300/50 p-6">
        <div className="overflow-hidden rounded-lg">
          <a href={details.data.link}>
            <img
              className="w-full cursor-pointer transition duration-200 ease-in-out transform hover:scale-110 rounded-lg h-auto"
              src={details.data.img}
              alt="portfolio image"
              onClick={openModal}
            />
          </a>
        </div>
        <span className="pt-5 text-sm font-normal text-base-content/65 block">
          {details.data.category}
        </span>

        <h2
          className="font-medium cursor-pointer text-xl duration-300 transition hover:text-primary text-base-content mt-2"
          onClick={openModal}
        >
          <a href={details.data.link}>{details.data.title}</a>
        </h2>
      </div>

      {showModal && (
        <Modal closeModal={closeModal}>
          <h2 className="text-primary text-3xl sm:text-4xl text-center font-slab font-bold">
            {details.data.modal.title}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 my-6 gap-2">
            <div className="space-y-2">
              <p className="flex items-center text-[15px] sm:text-lg text-base-content/85">
                Project :&nbsp;
                <span className="font-medium text-base-content">
                  {details.data.modal.project}
                </span>
              </p>
              <p className="flex items-center text-[15px] sm:text-lg text-base-content/85">
                Languages :&nbsp;
                <span className="font-medium text-base-content">
                  {details.data.modal.languages}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="flex items-center mt-2 lg:mt-0 text-[15px] sm:text-lg text-base-content/85">
                Client :&nbsp;{" "}
                <span className="font-medium text-base-content">
                  {details.data.modal.client}
                </span>
              </p>
              <p className="flex items-center text-[15px] sm:text-lg text-base-content/85">
                Preview :&nbsp;
                <span className="font-medium text-primary hover:underline underline-offset-4">
                  <a
                    href={details.data.modal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.data.modal.preview}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <p className="text-base-content/80 font-normal text-[15px] sm:text-base leading-relaxed">
            {details.data.modal.description}
          </p>
          <div className="pr-3">
            <img
              className="w-full md:h-[450px] h-auto object-cover rounded-xl mt-6"
              src={details.data.modal.img}
              alt="portfolio image"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

PortfolioCard.propTypes = {
  details: PropTypes.object,
};

export default PortfolioCard;
