import PropTypes from "prop-types";

const Card = ({ details }) => {
  return (
    <div
      className={`${details.data.bgColor} dark:bg-transparent py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-dark-border dark:border-2`}
    >
      <span className="text-tiny text-text-primary dark:text-dark-text">
        {details.data.year}
      </span>
      <h3 className="text-xl dark:text-white">{details.data.title}</h3>
      <p className="dark:text-dark-text">{details.data.subTitle}</p>
      {details.data.description && (
        <p className="text-sm text-text-primary dark:text-main-text leading-relaxed pt-1">
          {details.data.description}
        </p>
      )}
    </div>
  );
};

Card.propTypes = {
  details: PropTypes.object,
};

export default Card;
