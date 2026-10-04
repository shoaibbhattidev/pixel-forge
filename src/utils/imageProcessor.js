import { encode as encodeAvif } from "@jsquash/avif";
import { optimise } from "@jsquash/oxipng";

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

export async function resizeImage(file, width, height, mode = "stretch") {
  const image = await loadImage(file);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  canvas.width = width;
  canvas.height = height;

  // Stretch
  if (mode === "stretch") {
    context.drawImage(image, 0, 0, width, height);

    return canvas;
  }

  // Fit
  if (mode === "fit") {
    const scale = Math.min(width / image.width, height / image.height);

    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.drawImage(image, x, y, drawWidth, drawHeight);

    return canvas;
  }

  // Fill / Crop
  const scale = Math.max(width / image.width, height / image.height);

  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);

  return canvas;
}

export async function optimizePng(canvas) {
  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create PNG"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });

  const pngBuffer = await pngBlob.arrayBuffer();

  const optimizedBuffer = await optimise(pngBuffer);

  return new Blob([optimizedBuffer], {
    type: "image/png",
  });
}

export async function canvasToBlob(canvas, type = "image/webp", quality = 0.8) {
  // AVIF requires a real AVIF encoder.
  if (type === "image/png") {
    return optimizePng(canvas);
  }
  if (type === "image/avif") {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const avifBuffer = await encodeAvif(imageData, {
      quality: Math.round(quality * 100),
    });

    return new Blob([avifBuffer], {
      type: "image/avif",
    });
  }

  // Existing JPEG / PNG / WebP path
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function optimizeImage(
  file,
  width,
  height,
  type = "image/webp",
  quality = 0.8,
  mode = "stretch",
) {
  const canvas = await resizeImage(file, width, height, mode);

  const blob = await canvasToBlob(canvas, type, quality);

  return blob;
}
export async function optimizeToTargetSize(
  file,
  width,
  height,
  type = "image/webp",
  targetBytes,
  minQuality = 0.1,
  maxQuality = 1,
  mode = "stretch",
  postProcess = async (blob) => blob,
) {
  const canvas = await resizeImage(file, width, height, mode);

  // Test the final exported blob, including optional metadata.
  const maxBlob = await postProcess(
    await canvasToBlob(canvas, type, maxQuality),
  );

  // If maximum quality is already below the target, keep it.
  if (maxBlob.size <= targetBytes) {
    return maxBlob;
  }

  let low = minQuality;
  let high = maxQuality;

  let bestBlob = null;

  for (let i = 0; i < 14; i++) {
    const quality = (low + high) / 2;

    const blob = await postProcess(await canvasToBlob(canvas, type, quality));

    if (blob.size <= targetBytes) {
      bestBlob = blob;

      // Try higher quality to get closer to target.
      low = quality;
    } else {
      // Too large.
      high = quality;
    }
  }

  if (bestBlob) {
    return bestBlob;
  }

  // Nothing could fit under target.
  return postProcess(await canvasToBlob(canvas, type, minQuality));
}
