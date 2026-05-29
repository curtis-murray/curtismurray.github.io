import PropTypes from "prop-types";

// Education / experience entry. Description is always shown; the card lifts and
// picks up a primary-tinted ring on hover.
const Card = ({ details }) => {
  return (
    <div className="group bg-base-200/60 ring-1 ring-base-300/50 py-5 px-5 space-y-2 mb-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/40">
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
