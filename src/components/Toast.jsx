function Toast({ type, message, onClose }) {
  const isWarning = type === "warning";

  return (
    <div
      className="toast show position-fixed top-0 end-0 m-4 shadow-lg"
      role="alert"
      style={{ zIndex: 1080 }}
    >
      <div className="toast-header">
        <i
          className={`bi ${
            isWarning
              ? "bi-exclamation-triangle-fill text-warning"
              : "bi-x-circle-fill text-danger"
          } me-2`}
        ></i>

        <strong className="me-auto">
          {isWarning ? "Warning" : "Upload Error"}
        </strong>

        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      <div className="toast-body">{message}</div>
    </div>
  );
}

export default Toast;
