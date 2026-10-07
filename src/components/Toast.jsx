function Toast({ type, message, onClose }) {
  const isWarning = type === "warning";
  const isSuccess = type === "success";
  const isDanger = !isWarning && !isSuccess;
  return (
    <div
      className="toast show position-fixed top-0 end-0 m-3 m-md-4 shadow-lg"
      role={isDanger ? "alert" : "status"}
      aria-live="polite"
      style={{ zIndex: 1080, maxWidth: "min(92vw, 520px)" }}
    >
      <div className="toast-header">
        <i
          className={`bi ${isWarning ? "bi-exclamation-triangle-fill text-warning" : isSuccess ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}
          aria-hidden="true"
        ></i>
        <strong className="me-auto">
          {isWarning ? "Warning" : isSuccess ? "Done" : "Error"}
        </strong>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close notification" />
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
export default Toast;
