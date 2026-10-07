import { useRef, useState } from "react";

function DropZone({ onFilesSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleInputChange(event) {
    const files = Array.from(event.target.files);

    onFilesSelected(files);

    event.target.value = "";
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);

    onFilesSelected(files);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        card drop-zone
        border-2
        border-dashed
        rounded-4
        text-center
        transition
        ${
          isDragging
            ? "border-primary bg-primary-subtle"
            : "border-secondary-subtle"
        }
      `}
    >
      <div className="card-body py-5">
        <div className="mb-3">
          <i className="bi bi-cloud-arrow-up display-4 text-primary"></i>
        </div>

        <h2 className="h4 fw-semibold">Drop your images here</h2>

        <p className="text-secondary mb-4">
          Drag & drop your images or choose files from your device
        </p>

        <button
          type="button"
          onClick={openFilePicker}
          className="btn btn-primary px-4 rounded-pill"
        >
          <i className="bi bi-folder2-open me-2"></i>
          Choose Images
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleInputChange}
          className="d-none"
        />

        <p className="small text-secondary mt-3 mb-0">
          JPG · PNG · WebP · AVIF
        </p>
      </div>
    </section>
  );
}

export default DropZone;
