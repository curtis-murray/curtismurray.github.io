import PropTypes from "prop-types";

const CardPub = ({ details }) => {
  return (
    <a
      href={details.data.doi}
      className={`${details.data.bgColor} dark:bg-transparent py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-dark-border dark:border-2 block`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-tiny text-text-primary dark:text-dark-text">
          {details.data.year}
        </span>
        {details.data.metric && (
          <span className="text-tiny px-2 py-0.5 rounded-full bg-btn-primary text-white font-medium">
            {details.data.metric}
          </span>
        )}
      </div>
      <h3 className="text-xl dark:text-white">{details.data.title}</h3>
      <p className="dark:text-dark-text">
        {details.data.authors.map((author, i) => (
          <span key={i}>
            {i > 0 && ", "}
            {author === "Curtis Murray" ? (
              <span className="font-semibold text-btn-secondary">
                {author}
              </span>
            ) : (
              author
            )}
          </span>
        ))}
      </p>
      <p className="dark:text-dark-text italic">{details.data.journal}</p>
      <span className="text-tiny text-text-secondary dark:text-dark-text">
        DOI: {details.data.doi}
      </span>
    </a>
  );
};

CardPub.propTypes = {
  details: PropTypes.shape({
    data: PropTypes.shape({
      bgColor: PropTypes.string,
      year: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      journal: PropTypes.string,
      metric: PropTypes.string,
      doi: PropTypes.string,
    }),
  }),
};

export default CardPub;
