import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import DropZone from "./components/DropZone";
import ImageGrid from "./components/ImageGrid";
import Toast from "./components/Toast";
import { validateImage } from "./utils/validateImage";
import { createImageId } from "./utils/createImageId";
import { optimizeImage, optimizeToTargetSize } from "./utils/imageProcessor";
import { applyMetadata } from "./utils/metadataProcessor";
import JSZip from "jszip";

function App() {
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [imageSettings, setImageSettings] = useState({});

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

  const handleSettingsChange = useCallback((id, settings) => {
    setImageSettings((previous) => ({
      ...previous,
      [id]: settings,
    }));
  }, []);

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
        const settings = imageSettings[image.id] || {};

        handleOptimizeImage(
          image.id,
          null,
          settings.outputFormat || "image/webp",
          "processing",
        );

        const imageElement = new Image();

        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
          imageElement.src = image.previewUrl;
        });

        const width = settings.resizeWidth || imageElement.naturalWidth;
        const height = settings.resizeHeight || imageElement.naturalHeight;
        const outputFormat = settings.outputFormat || "image/webp";
        const resizeMode = settings.resizeMode || "stretch";
        const quality = Number.isFinite(settings.quality)
          ? settings.quality / 100
          : 0.8;

        let blob;

        if (settings.targetSize) {
          const targetBytes =
            settings.targetUnit === "MB"
              ? settings.targetSize * 1024 * 1024
              : settings.targetSize * 1024;

          blob = await optimizeToTargetSize(
            image.file,
            width,
            height,
            outputFormat,
            targetBytes,
            0.1,
            1,
            resizeMode,
          );
        } else {
          blob = await optimizeImage(
            image.file,
            width,
            height,
            outputFormat,
            quality,
            resizeMode,
          );
        }

        blob = await applyMetadata(
          blob,
          image.file,
          outputFormat,
          settings.metadataMode || "preserve",
          settings.metadata || {},
        );

        handleOptimizeImage(
          image.id,
          blob,
          outputFormat,
          "optimized",
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

