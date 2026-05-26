import PropTypes from "prop-types";

const Tag = ({ tagName }) => {
  return (
    <span className="cursor-default rounded-lg bg-base-200/70 ring-1 ring-base-300/50 px-4 py-2 text-sm text-base-content/85">
      {tagName}
    </span>
  );
};

Tag.propTypes = {
  tagName: PropTypes.string,
};

export default Tag;
