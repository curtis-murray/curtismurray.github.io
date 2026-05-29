import PropTypes from "prop-types";

// Publication entry. The whole card is a link to the DOI (via a stretched
// title link), and an optional `extra` link (e.g. a live dashboard or a
// conference talk) sits above it with its own click target — so we get a
// secondary action without nesting anchors.
const CardPub = ({ details }) => {
  const { doi, year, metric, title, authors, journal, extra } = details.data;

  return (
    <div className="group relative bg-base-200/60 ring-1 ring-base-300/50 py-5 px-5 space-y-2 mb-5 rounded-xl transition-colors hover:ring-primary/50">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium tracking-wide uppercase text-primary">
          {year}
        </span>
        {metric && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-content font-medium">
            {metric}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
        <a
          href={doi}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 after:rounded-xl"
        >
          {title}
        </a>
      </h3>
      <p className="text-base-content/75">
        {authors.map((author, i) => (
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
      <p className="text-base-content/75 italic">{journal}</p>
      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
        <span className="text-xs text-base-content/50">DOI: {doi}</span>
        {extra?.href && (
          <a
            href={extra.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-xs font-medium text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors"
          >
            {extra.label} →
          </a>
        )}
      </div>
    </div>
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
      extra: PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string,
      }),
    }),
  }),
};

export default CardPub;
