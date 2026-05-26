import PropTypes from "prop-types";

// Education / experience entry.
const Card = ({ details }) => {
  return (
    <div className="bg-base-200/60 ring-1 ring-base-300/50 py-5 px-5 space-y-2 mb-5 rounded-xl">
      <span className="text-xs font-medium tracking-wide uppercase text-primary">
        {details.data.year}
      </span>
      <h3 className="text-xl font-semibold text-base-content">
        {details.data.title}
      </h3>
      <p className="text-base-content/75">{details.data.subTitle}</p>
      {details.data.description && (
        <p className="text-sm text-base-content/70 leading-relaxed pt-1">
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
