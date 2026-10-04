function MetadataPanel({ imageId, mode, setMode, metadata, setMetadata, outputFormat }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setMetadata((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  return (
    <div className="border-top mt-4 pt-4">
      <h4 className="h6 mb-3">Metadata</h4>

      {/* Metadata Mode */}
      <div className="btn-group w-100 mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          name={`metadataMode-${imageId}`}
          id={`metadata-preserve-${imageId}`}
          value="preserve"
          checked={mode === "preserve"}
          onChange={(event) => setMode(event.target.value)}
        />

        <label
          className="btn btn-outline-primary"
          htmlFor={`metadata-preserve-${imageId}`}
        >
          Preserve
        </label>

        <input
          type="radio"
          className="btn-check"
          name="metadataMode"
          id={`metadata-remove-${imageId}`}
          value="remove"
          checked={mode === "remove"}
          onChange={(event) => setMode(event.target.value)}
        />

        <label
          className="btn btn-outline-danger"
          htmlFor={`metadata-remove-${imageId}`}
        >
          Remove
        </label>

        <input
          type="radio"
          className="btn-check"
          name="metadataMode"
          id={`metadata-custom-${imageId}`}
          value="custom"
          checked={mode === "custom"}
          onChange={(event) => setMode(event.target.value)}
        />

        <label
          className="btn btn-outline-success"
          htmlFor={`metadata-custom-${imageId}`}
        >
          Custom
        </label>
      </div>

      {mode === "preserve" && (
        <div className="alert alert-secondary small mb-0">
          Original metadata will be preserved when supported by the output
          format.
        </div>
      )}

      {mode === "remove" && (
        <div className="alert alert-warning small mb-0">
          Metadata is removed by the clean canvas export. This mode does not add metadata back.
        </div>
      )}

      {mode === "custom" && (
        <div>
          <div className="alert alert-info small">\n            Custom EXIF writing is supported for JPEG output. Empty fields are ignored.\n          </div>\n\n          {/* Basic Information */
          <h5 className="small fw-bold mt-3">Basic Information</h5>

          <div className="row g-2">
            <div className="col-12">
              <label className="form-label small">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={metadata.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label small">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={metadata.description}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Author</label>
              <input
                type="text"
                className="form-control"
                name="author"
                value={metadata.author}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Copyright</label>
              <input
                type="text"
                className="form-control"
                name="copyright"
                value={metadata.copyright}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label small">Keywords</label>
              <input
                type="text"
                className="form-control"
                name="keywords"
                value={metadata.keywords}
                onChange={handleChange}
                placeholder="photo, nature, travel"
              />
            </div>
          </div>

          {/* Camera */}
          <h5 className="small fw-bold mt-4">Camera / Device</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small">Make</label>
              <input
                type="text"
                className="form-control"
                name="cameraMake"
                value={metadata.cameraMake}
                onChange={handleChange}
                placeholder="Canon"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Model</label>
              <input
                type="text"
                className="form-control"
                name="cameraModel"
                value={metadata.cameraModel}
                onChange={handleChange}
                placeholder="EOS R5"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Lens</label>
              <input
                type="text"
                className="form-control"
                name="lensModel"
                value={metadata.lensModel}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Software</label>
              <input
                type="text"
                className="form-control"
                name="software"
                value={metadata.software}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date */}
          <h5 className="small fw-bold mt-4">Date & Time</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small">Date Taken</label>
              <input
                type="date"
                className="form-control"
                name="dateTaken"
                value={metadata.dateTaken}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Time Taken</label>
              <input
                type="time"
                className="form-control"
                name="timeTaken"
                value={metadata.timeTaken}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* GPS */}
          <h5 className="small fw-bold mt-4">GPS / Location</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small">Latitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="latitude"
                value={metadata.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Longitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="longitude"
                value={metadata.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Altitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="altitude"
                value={metadata.altitude}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">Location Name</label>
              <input
                type="text"
                className="form-control"
                name="locationName"
                value={metadata.locationName}
                onChange={handleChange}
                placeholder="Lahore"
              />
            </div>
          </div>

          {/* Camera Settings */}
          <h5 className="small fw-bold mt-4">Camera Settings</h5>

          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small">ISO</label>
              <input
                type="number"
                className="form-control"
                name="iso"
                value={metadata.iso}
                onChange={handleChange}
              />
            </div>

            <div className="col-6">
              <label className="form-label small">Focal Length</label>
              <input
                type="text"
                className="form-control"
                name="focalLength"
                value={metadata.focalLength}
                onChange={handleChange}
                placeholder="50mm"
              />
            </div>

            <div className="col-6">
              <label className="form-label small">Exposure Time</label>
              <input
                type="text"
                className="form-control"
                name="exposureTime"
                value={metadata.exposureTime}
                onChange={handleChange}
                placeholder="1/250"
              />
            </div>

            <div className="col-6">
              <label className="form-label small">F-Number</label>
              <input
                type="text"
                className="form-control"
                name="fNumber"
                value={metadata.fNumber}
                onChange={handleChange}
                placeholder="f/2.8"
              />
            </div>
          </div>

          {/* Custom Fields */}
          <h5 className="small fw-bold mt-4">Custom Metadata</h5>

          <div className="alert alert-info small">
            Additional custom fields can be added later without changing the
            image processing system.
          </div>
        </div>
      )}
    </div>
  );
}

export default MetadataPanel;
