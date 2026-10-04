import { useEffect, useState } from "react";
import { optimizeImage, optimizeToTargetSize } from "../utils/imageProcessor";
import imagePresets from "../utils/imagePresets";
import MetadataPanel from "./MetadataPanel";
import { applyMetadata, readMetadata } from "../utils/metadataProcessor";
import MetadataViewer from "./MetadataViewer";
import { useImageSettings } from "../hooks/useImageSettings";

function ImageCard({ image, onRemove, onOptimize, onSettingsChange }) {
  const {
    resizeWidth,
    setResizeWidth,
    resizeHeight,
    setResizeHeight,
    lockAspectRatio,
    setLockAspectRatio,
    outputFormat,
    setOutputFormat,
    quality,
    setQuality,
    selectedPreset,
    setSelectedPreset,
    targetSize,
    setTargetSize,
    targetUnit,
    setTargetUnit,
    resizeMode,
    setResizeMode,
    metadataMode,
    setMetadataMode,
    metadata,
    setMetadata,
  } = useImageSettings();
  const {
    file,
    id,
    previewUrl,
    optimizedUrl,
    optimizedSize,
    optimizationStatus,
  } = image;
  const savedBytes =
    optimizedSize !== null ? Math.max(file.size - optimizedSize, 0) : null;

  const compressionPercent =
    optimizedSize !== null
      ? Math.max(((file.size - optimizedSize) / file.size) * 100, 0)
      : null;

  const [imageMetadata, setImageMetadata] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    onSettingsChange?.(id, {
      resizeWidth: Number(resizeWidth) || null,
      resizeHeight: Number(resizeHeight) || null,
      outputFormat,
      quality,
      targetSize: targetSize ? Number(targetSize) : null,
      targetUnit,
      resizeMode,
      metadataMode,
      metadata,
    });
  }, [
    id,
    resizeWidth,
    resizeHeight,
    outputFormat,
    quality,
    targetSize,
    targetUnit,
    resizeMode,
    metadataMode,
    metadata,
    onSettingsChange,
  ]);
  useEffect(() => {
    const imageElement = new Image();

    imageElement.onload = () => {
      const width = imageElement.naturalWidth;
      const height = imageElement.naturalHeight;

      setDimensions({
        width,
        height,
      });

      setResizeWidth(width);
      setResizeHeight(height);
    };

    imageElement.src = previewUrl;

    return () => {
      imageElement.onload = null;
    };
  }, [previewUrl]);

  async function handleViewMetadata() {
    if (showMetadata) {
      setShowMetadata(false);
      return;
    }

    setMetadataLoading(true);

    try {
      const data = await readMetadata(file);

      setImageMetadata(data);
      setShowMetadata(true);
    } catch (error) {
      console.error("Metadata read failed:", error);

      setImageMetadata({});
      setShowMetadata(true);
    } finally {
      setMetadataLoading(false);
    }
  }

  function handlePresetChange(event) {
    const presetId = event.target.value;

    setSelectedPreset(presetId);

    if (!presetId) return;

    const preset = Object.values(imagePresets).find(
      (preset) => preset.id === presetId,
    );

    if (!preset) return;

    setResizeWidth(preset.width);
    setResizeHeight(preset.height);
    setOutputFormat(preset.format);
    setQuality(preset.quality);
  }

  function handleHeightChange(event) {
    const newHeight = Number(event.target.value);

    setResizeHeight(newHeight);
    setSelectedPreset("");

    if (lockAspectRatio && dimensions) {
      const ratio = dimensions.width / dimensions.height;
      setResizeWidth(Math.round(newHeight * ratio));
    }
  }

  function handleWidthChange(event) {
    const newWidth = Number(event.target.value);

    setResizeWidth(newWidth);
    setSelectedPreset("");

    if (lockAspectRatio && dimensions) {
      const ratio = dimensions.height / dimensions.width;
      setResizeHeight(Math.round(newWidth * ratio));
    }
  }

  async function handleResize() {
    if (!resizeWidth || !resizeHeight) return;

    onOptimize(id, null, outputFormat, "processing");

    try {
      let blob;

      if (targetSize) {
        const size = Number(targetSize);

        const targetBytes =
          targetUnit === "MB" ? size * 1024 * 1024 : size * 1024;

        blob = await optimizeToTargetSize(
          file,
          Number(resizeWidth),
          Number(resizeHeight),
          outputFormat,
          targetBytes,
          0.1,
          1,
          resizeMode,
        );
      } else {
        blob = await optimizeImage(
          file,
          Number(resizeWidth),
          Number(resizeHeight),
          outputFormat,
          quality / 100,
          resizeMode,
        );
      }

      blob = await applyMetadata(
        blob,
        file,
        outputFormat,
        metadataMode,
        metadata,
      );

      onOptimize(id, blob, outputFormat, "optimized");
    } catch (error) {
      console.error("Optimization failed:", error);

      onOptimize(id, null, outputFormat, "failed");
    }
  }

  useEffect(() => {
    return () => {
      if (optimizedUrl) {
        URL.revokeObjectURL(optimizedUrl);
      }
    };
  }, [optimizedUrl]);

  function getExtension(format) {
    const extensions = {
      "image/webp": "webp",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/avif": "avif",
    };

    return extensions[format] || "webp";
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  }

  function handleDownload() {
    if (!optimizedUrl) return;

    const link = document.createElement("a");

    link.href = optimizedUrl;
    const extension = getExtension(outputFormat);

    link.download = `${file.name.replace(/\.[^/.]+$/, "")}-optimized.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="card h-100 overflow-hidden border-0 shadow-sm">
      {/* Original Preview */}
      {previewUrl && (
        <div className="bg-light p-3 position-relative">
          <img
            src={previewUrl}
            alt={file.name}
            className="img-fluid d-block mx-auto"
          />

          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
            onClick={() => onRemove(id)}
            aria-label={`Remove ${file.name}`}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      <div className="card-body">
        {/* File Information */}
        <h3 className="h6 text-truncate" title={file.name}>
          {file.name}
        </h3>

        <div className="small text-secondary">
          <div className="d-flex justify-content-between">
            <span>Size</span>

            <span>{formatBytes(file.size)}</span>
          </div>

          {dimensions && (
            <div className="d-flex justify-content-between mt-1">
              <span>Dimensions</span>

              <span>
                {dimensions.width} × {dimensions.height}
              </span>
            </div>
          )}

          <div className="d-flex justify-content-between mt-1">
            <span>Format</span>

            <span>{file.type.replace("image/", "").toUpperCase()}</span>
          </div>
        </div>

        {/* Resize Controls */}
        <div className="border-top mt-3 pt-3">
          <h4 className="h6 mb-3">Resize</h4>

          <div className="mb-3">
            <label htmlFor={`preset-${id}`} className="form-label small">
              Preset
            </label>
            <select
              id={`preset-${id}`}
              className="form-select"
              value={selectedPreset}
              onChange={handlePresetChange}
            >
              <option value="">Custom</option>

              {[
                "Instagram",
                "Facebook",
                "TikTok",
                "YouTube",
                "WhatsApp",
                "Discord",
                "X",
                "LinkedIn",
                "Pinterest",
                "Telegram",
                "General",
              ].map((platform) => {
                const presets = Object.values(imagePresets).filter(
                  (preset) => preset.platform === platform,
                );

                return (
                  <optgroup key={platform} label={platform}>
                    {presets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <div className="row g-2">
            {/* Width */}
            <div className="col-6">
              <label htmlFor={`width-${id}`} className="form-label small">
                Width
              </label>

              <input
                id={`width-${id}`}
                type="number"
                className="form-control"
                value={resizeWidth}
                onChange={handleWidthChange}
                min="1"
              />
            </div>

            {/* Height */}
            <div className="col-6">
              <label htmlFor={`height-${id}`} className="form-label small">
                Height
              </label>

              <input
                id={`height-${id}`}
                type="number"
                className="form-control"
                value={resizeHeight}
                onChange={handleHeightChange}
                min="1"
              />
            </div>
          </div>

          {/* Resize Mode */}
          <div className="mt-3">
            <label htmlFor={`resize-mode-${id}`} className="form-label small">
              Resize Mode
            </label>

            <select
              id={`resize-mode-${id}`}
              className="form-select"
              value={resizeMode}
              onChange={(event) => setResizeMode(event.target.value)}
            >
              <option value="fit">Fit</option>
              <option value="fill">Fill</option>
              <option value="crop">Crop</option>
              <option value="stretch">Stretch</option>
            </select>

            <div className="form-text">
              Choose how the image should fit the target dimensions.
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id={`lock-${id}`}
              checked={lockAspectRatio}
              onChange={(event) => setLockAspectRatio(event.target.checked)}
            />

            <label className="form-check-label small" htmlFor={`lock-${id}`}>
              Lock aspect ratio
            </label>
          </div>

          {/* Quality */}
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <label
                htmlFor={`quality-${id}`}
                className="form-label small mb-0"
              >
                Quality
              </label>

              <span className="badge text-bg-primary">{quality}%</span>
            </div>

            <input
              id={`quality-${id}`}
              type="range"
              className="form-range"
              min="1"
              max="100"
              step="1"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />
          </div>

          {/* Target File Size */}
          <div className="mt-3">
            <label htmlFor={`target-size-${id}`} className="form-label small">
              Target File Size
            </label>

            <div className="input-group">
              <input
                id={`target-size-${id}`}
                type="number"
                className="form-control"
                placeholder="Optional"
                min="1"
                value={targetSize}
                onChange={(event) => setTargetSize(event.target.value)}
              />

              <select
                className="form-select"
                value={targetUnit}
                onChange={(event) => setTargetUnit(event.target.value)}
                style={{ maxWidth: "90px" }}
              >
                <option value="KB">KB</option>
                <option value="MB">MB</option>
              </select>
            </div>

            <div className="form-text">
              Leave empty to use quality settings.
            </div>
          </div>

          {/* Output Format */}
          <div className="mt-3">
            <label htmlFor={`format-${id}`} className="form-label small">
              Output Format
            </label>

            <select
              id={`format-${id}`}
              className="form-select"
              value={outputFormat}
              onChange={(event) => setOutputFormat(event.target.value)}
            >
              <option value="image/webp">WebP</option>

              <option value="image/jpeg">JPEG</option>

              <option value="image/png">PNG</option>

              <option value="image/avif">AVIF</option>
            </select>
          </div>

          <MetadataPanel
            imageId={id}
            mode={metadataMode}
            setMode={setMetadataMode}
            metadata={metadata}
            setMetadata={setMetadata}
            outputFormat={outputFormat}
          />

          <div className="border-top mt-4 pt-4">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleViewMetadata}
              disabled={metadataLoading}
            >
              <i className="bi bi-info-circle me-2"></i>

              {metadataLoading
                ? "Reading Metadata..."
                : showMetadata
                  ? "Hide Metadata"
                  : "View Metadata"}
            </button>
          </div>

          {showMetadata && (
            <div className="mt-3">
              <h5 className="small fw-bold">Image Metadata</h5>

              <MetadataViewer metadata={imageMetadata} />
            </div>
          )}

          {optimizationStatus === "ready" && (
            <span className="badge text-bg-secondary">Ready</span>
          )}

          {optimizationStatus === "processing" && (
            <span className="badge text-bg-warning">Processing...</span>
          )}

          {optimizationStatus === "optimized" && (
            <span className="badge text-bg-success">Optimized</span>
          )}

          {optimizationStatus === "failed" && (
            <span className="badge text-bg-danger">Failed</span>
          )}

          {/* Optimize Button */}
          <button
            type="button"
            className="btn btn-primary w-100 mt-3"
            onClick={handleResize}
          >
            <i className="bi bi-magic me-2"></i>
            Optimize Image
          </button>
        </div>

        {/* Optimized Result */}
        {optimizedUrl && (
          <div className="border-top mt-4 pt-4">
            <h4 className="h6 mb-3">Optimized Preview</h4>

            {/* Optimized Image */}
            <div className="bg-light rounded p-3">
              <img
                src={optimizedUrl}
                alt="Optimized preview"
                className="img-fluid d-block mx-auto"
              />
            </div>

            {/* Optimization Statistics */}
            <div className="small text-secondary mt-3">
              <div className="d-flex justify-content-between">
                <span>Original</span>

                <strong>{formatBytes(file.size)}</strong>
              </div>

              <div className="d-flex justify-content-between mt-1">
                <span>Optimized</span>

                <strong>
                  {optimizedSize !== null ? formatBytes(optimizedSize) : "--"}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-1">
                <span>Saved</span>

                <strong>
                  {savedBytes !== null
                    ? formatBytes(Math.max(savedBytes, 0))
                    : "--"}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-1">
                <span>Reduction</span>

                <strong>
                  {compressionPercent !== null
                    ? `${Math.max(compressionPercent, 0).toFixed(1)}%`
                    : "--"}
                </strong>
              </div>
            </div>

            {/* Download */}
            <button
              type="button"
              className="btn btn-success w-100 mt-3"
              onClick={handleDownload}
              disabled={!optimizedUrl}
            >
              <i className="bi bi-download me-2"></i>
              Download Optimized
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
