import PropTypes from "prop-types";

const Modal = ({ closeModal, children }) => {
  return (
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black/70"
      onClick={closeModal}
    >
      <div
        className="!max-w-[800px] absolute left-[50%] top-[50%] mr-auto ml-auto flex w-[88%] translate-x-[-50%] translate-y-[-50%] items-center rounded-2xl p-5 sm:p-7 bg-base-100 text-base-content ring-1 ring-base-300/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[80vh] w-full">{children}</div>
        <button
          type="button"
          aria-label="Close"
          className="absolute -top-4 -right-4 flex h-11 w-11 items-center justify-center rounded-full bg-base-200 text-base-content ring-1 ring-base-300/60 text-2xl leading-none shadow-lg hover:bg-primary hover:text-primary-content transition-colors"
          onClick={closeModal}
        >
          ×
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  closeModal: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;
