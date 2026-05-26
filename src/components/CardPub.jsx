import PropTypes from "prop-types";

// Publication entry — links to the DOI.
const CardPub = ({ details }) => {
  return (
    <a
      href={details.data.doi}
      className="group block bg-base-200/60 ring-1 ring-base-300/50 py-5 px-5 space-y-2 mb-5 rounded-xl transition-colors hover:ring-primary/50"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium tracking-wide uppercase text-primary">
          {details.data.year}
        </span>
        {details.data.metric && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-content font-medium">
            {details.data.metric}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
        {details.data.title}
      </h3>
      <p className="text-base-content/75">
        {details.data.authors.map((author, i) => (
          <span key={i}>
            {i > 0 && ", "}
            {author === "Curtis Murray" ? (
              <span className="font-semibold text-base-content">{author}</span>
            ) : (
              author
            )}
          </span>
        ))}
      </p>
      <p className="text-base-content/75 italic">{details.data.journal}</p>
      <span className="text-xs text-base-content/50">
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
