import { useState } from "react";

export function useImageSettings() {
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");

  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  const [outputFormat, setOutputFormat] = useState("image/webp");

  const [quality, setQuality] = useState(80);

  const [selectedPreset, setSelectedPreset] = useState("");

  const [targetSize, setTargetSize] = useState("");
  const [targetUnit, setTargetUnit] = useState("KB");

  const [resizeMode, setResizeMode] = useState("stretch");

  const [metadataMode, setMetadataMode] = useState("preserve");

  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    subject: "",
    author: "",
    creator: "",
    copyright: "",
    rights: "",
    keywords: "",

    cameraMake: "",
    cameraModel: "",
    lensModel: "",
    software: "",
    firmware: "",
    serialNumber: "",

    dateTaken: "",
    timeTaken: "",
    dateCreated: "",
    dateModified: "",
    timeZone: "",

    latitude: "",
    longitude: "",
    altitude: "",
    city: "",
    state: "",
    country: "",
    locationName: "",

    orientation: "",
    exposureTime: "",
    fNumber: "",
    iso: "",
    focalLength: "",
    flash: "",
    whiteBalance: "",
    meteringMode: "",

    rating: "",
  });

  return {
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
  };
}
