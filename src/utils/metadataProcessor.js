import ExifReader from "exifreader";
import piexif from "piexifjs";

function isNonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function toExifDate(date, time) {
  if (!isNonEmpty(date)) return null;
  const cleanDate = String(date).replace(/-/g, ":");
  const cleanTime = isNonEmpty(time) ? String(time) : "00:00:00";
  return `${cleanDate} ${cleanTime}:00`.replace(/:00$/, "");
}

function toRational(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const denominator = 1000000;
  return [Math.round(number * denominator), denominator];
}

function toBinaryString(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return atob(base64);
}

function binaryStringToBlob(binary, type) {
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

function buildCustomExif(metadata) {
  const zeroth = {};
  const exif = {};
  const gps = {};

  if (isNonEmpty(metadata.title)) {
    zeroth[piexif.ImageIFD.ImageDescription] = String(metadata.title);
  }
  if (isNonEmpty(metadata.author)) {
    zeroth[piexif.ImageIFD.Artist] = String(metadata.author);
  }
  if (isNonEmpty(metadata.copyright)) {
    zeroth[piexif.ImageIFD.Copyright] = String(metadata.copyright);
  }
  if (isNonEmpty(metadata.software)) {
    zeroth[piexif.ImageIFD.Software] = String(metadata.software);
  }
  if (isNonEmpty(metadata.cameraMake)) {
    zeroth[piexif.ImageIFD.Make] = String(metadata.cameraMake);
  }
  if (isNonEmpty(metadata.cameraModel)) {
    zeroth[piexif.ImageIFD.Model] = String(metadata.cameraModel);
  }

  if (isNonEmpty(metadata.dateTaken)) {
    const date = toExifDate(metadata.dateTaken, metadata.timeTaken);
    if (date) {
      exif[piexif.ExifIFD.DateTimeOriginal] = date;
      exif[piexif.ExifIFD.DateTimeDigitized] = date;
    }
  }

  if (isNonEmpty(metadata.lensModel)) {
    exif[piexif.ExifIFD.LensModel] = String(metadata.lensModel);
  }

  if (isNonEmpty(metadata.iso)) {
    const iso = Number(metadata.iso);
    if (Number.isFinite(iso)) {
      exif[piexif.ExifIFD.ISOSpeedRatings] = Math.round(iso);
    }
  }

  if (isNonEmpty(metadata.exposureTime)) {
    const match = String(metadata.exposureTime).trim().match(/^(\\d+)\\s*\\/\\s*(\\d+)$/);
    const value = match
      ? [Number(match[1]), Number(match[2])]
      : toRational(metadata.exposureTime);
    if (value) exif[piexif.ExifIFD.ExposureTime] = value;
  }

  if (isNonEmpty(metadata.fNumber)) {
    const value = String(metadata.fNumber).replace(/^f\\//i, "");
    const rational = toRational(value);
    if (rational) exif[piexif.ExifIFD.FNumber] = rational;
  }

  if (isNonEmpty(metadata.focalLength)) {
    const value = String(metadata.focalLength).replace(/mm$/i, "").trim();
    const rational = toRational(value);
    if (rational) exif[piexif.ExifIFD.FocalLength] = rational;
  }

  const latitude = Number(metadata.latitude);
  const longitude = Number(metadata.longitude);

  if (Number.isFinite(latitude) && Math.abs(latitude) <= 90) {
    gps[piexif.GPSIFD.GPSLatitudeRef] = latitude < 0 ? "S" : "N";
    gps[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(Math.abs(latitude));
  }

  if (Number.isFinite(longitude) && Math.abs(longitude) <= 180) {
    gps[piexif.GPSIFD.GPSLongitudeRef] = longitude < 0 ? "W" : "E";
    gps[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(Math.abs(longitude));
  }

  if (isNonEmpty(metadata.altitude)) {
    const altitude = Number(metadata.altitude);
    if (Number.isFinite(altitude)) {
      gps[piexif.GPSIFD.GPSAltitudeRef] = altitude < 0 ? 1 : 0;
      gps[piexif.GPSIFD.GPSAltitude] = toRational(Math.abs(altitude));
    }
  }

  return { "0th": zeroth, Exif: exif, GPS: gps };
}

export async function readMetadata(file) {
  try {
    return await ExifReader.load(file);
  } catch (error) {
    console.error("Failed to read metadata:", error);
    return {};
  }
}

export async function applyMetadata(
  blob,
  sourceFile,
  outputFormat,
  mode = "preserve",
  customMetadata = {},
) {
  // Canvas encoders already produce clean output for remove mode.
  if (mode === "remove" || outputFormat !== "image/jpeg") {
    return blob;
  }

  try {
    const outputDataUrl = await fileToDataUrl(blob);
    let exifObject = {};

    if (mode === "preserve" && sourceFile.type === "image/jpeg") {
      const sourceDataUrl = await fileToDataUrl(sourceFile);
      exifObject = piexif.load(sourceDataUrl);
    } else if (mode === "custom") {
      exifObject = buildCustomExif(customMetadata);
    }

    if (
      !exifObject ||
      Object.values(exifObject).every(
        (value) => !value || (typeof value === "object" && Object.keys(value).length === 0),
      )
    ) {
      return blob;
    }

    const exifBytes = piexif.dump(exifObject);
    const modified = piexif.insert(exifBytes, outputDataUrl);
    return binaryStringToBlob(toBinaryString(modified), "image/jpeg");
  } catch (error) {
    console.error("Metadata write failed:", error);
    return blob;
  }
}
