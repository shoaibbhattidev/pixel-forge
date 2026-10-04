import { useEffect, useState } from "react";
import Header from "./components/Header";
import DropZone from "./components/DropZone";
import ImageGrid from "./components/ImageGrid";
import Toast from "./components/Toast";
import { validateImage } from "./utils/validateImage";
import { createImageId } from "./utils/createImageId";
import { optimizeImage } from "./utils/imageProcessor";
import JSZip from "jszip";

function App() {
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

  function handleFilesSelected(files) {
    const validImages = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const result = validateImage(file);

      if (!result.valid) {
        invalidFiles.push(result.error);
        return;
      }

      const duplicate = images.some(
        (image) =>
          image.file.name === file.name &&
          image.file.size === file.size &&
          image.file.lastModified === file.lastModified,
      );

      if (duplicate) {
        invalidFiles.push(`${file.name} is already added.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      validImages.push({
        id: createImageId(),
        file,
        previewUrl,
        optimizedUrl: null,
        optimizedSize: null,
        optimizationStatus: "ready",
      });
    });

    if (validImages.length > 0) {
      setImages((previousImages) => [...previousImages, ...validImages]);
    }

    if (invalidFiles.length > 0) {
      setNotification({
        type: "warning",
        message: invalidFiles.join(" "),
      });
    }
  }

  function handleOptimizeImage(id, blob, outputFormat, status) {
    setImages((previousImages) =>
      previousImages.map((image) => {
        if (image.id !== id) {
          return image;
        }

        // Processing state
        if (status === "processing") {
          return {
            ...image,
            optimizationStatus: "processing",
          };
        }

        // Failed state
        if (status === "failed") {
          return {
            ...image,
            optimizationStatus: "failed",
          };
        }

        // Optimized state
        const optimizedUrl = URL.createObjectURL(blob);

        if (image.optimizedUrl) {
          URL.revokeObjectURL(image.optimizedUrl);
        }

        return {
          ...image,
          optimizedUrl,
          optimizedSize: blob.size,
          outputFormat,
          optimizationStatus: "optimized",
        };
      }),
    );
  }

  async function handleOptimizeAll() {
    if (images.length === 0 || isOptimizingAll) return;

    setIsOptimizingAll(true);
    setBatchProgress(0);

    try {
      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        const imageElement = new Image();

        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
          imageElement.src = image.previewUrl;
        });

        const blob = await optimizeImage(
          image.file,
          imageElement.naturalWidth,
          imageElement.naturalHeight,
          "image/webp",
          0.8,
        );

        const optimizedUrl = URL.createObjectURL(blob);

        setImages((previousImages) =>
          previousImages.map((item) => {
            if (item.id !== image.id) {
              return item;
            }

            if (item.optimizedUrl) {
              URL.revokeObjectURL(item.optimizedUrl);
            }

            return {
              ...item,
              optimizedUrl,
              optimizedSize: blob.size,
            };
          }),
        );

        setBatchProgress(Math.round(((index + 1) / images.length) * 100));
      }
    } catch (error) {
      console.error("Batch optimization failed:", error);

      setNotification({
        type: "danger",
        message: "Some images could not be optimized.",
      });
    } finally {
      setIsOptimizingAll(false);
    }
  }

  function handleRemoveImage(id) {
    setImages((previousImages) => {
      const imageToRemove = previousImages.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);

        if (imageToRemove.optimizedUrl) {
          URL.revokeObjectURL(imageToRemove.optimizedUrl);
        }
      }

      return previousImages.filter((image) => image.id !== id);
    });
  }

  async function handleDownloadAll() {
    const optimizedImages = images.filter(
      (image) => image.optimizedUrl && image.optimizedSize,
    );

    if (optimizedImages.length === 0) {
      setNotification({
        type: "warning",
        message: "Optimize at least one image first.",
      });

      return;
    }

    try {
      const zip = new JSZip();

      for (const image of optimizedImages) {
        const response = await fetch(image.optimizedUrl);
        const blob = await response.blob();

        const extension =
          image.outputFormat === "image/jpeg"
            ? "jpg"
            : image.outputFormat === "image/png"
              ? "png"
              : "webp";

        const fileName = `${image.file.name.replace(/\.[^/.]+$/, "")}-optimized.${extension}`;

        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "optimized-images.zip";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ZIP creation failed:", error);

      setNotification({
        type: "danger",
        message: "Failed to create ZIP file.",
      });
    }
  }

  function handleClearAll() {
    setImages((previousImages) => {
      previousImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);

        if (image.optimizedUrl) {
          URL.revokeObjectURL(image.optimizedUrl);
        }
      });

      return [];
    });

    setBatchProgress(0);
  }

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-5 text-center">
          <h2 className="display-5 fw-bold">Optimize your images</h2>

          <p className="lead text-secondary">
            Resize, compress and convert images directly in your browser.
          </p>
        </div>

        <DropZone onFilesSelected={handleFilesSelected} />

        {notification && (
          <Toast
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {images.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
              <h2 className="h5 mb-0">
                Your Images
                <span className="badge text-bg-secondary ms-2">
                  {images.length}
                </span>
              </h2>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleOptimizeAll}
                  disabled={isOptimizingAll}
                >
                  {isOptimizingAll ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-magic me-2"></i>
                      Optimize All
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleClearAll}
                  disabled={isOptimizingAll}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear All
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={handleDownloadAll}
                  disabled={
                    isOptimizingAll ||
                    !images.some((image) => image.optimizedUrl)
                  }
                >
                  <i className="bi bi-file-earmark-zip me-2"></i>
                  Download All
                </button>
              </div>
            </div>

            {isOptimizingAll && (
              <div className="mb-4">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Optimizing images...</span>
                  <span>{batchProgress}%</span>
                </div>

                <div
                  className="progress"
                  role="progressbar"
                  aria-valuenow={batchProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-bar"
                    style={{ width: `${batchProgress}%` }}
                  >
                    {batchProgress}%
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <ImageGrid
          images={images}
          onRemove={handleRemoveImage}
          onOptimize={handleOptimizeImage}
        />
      </main>
    </>
  );
}

export default App;
