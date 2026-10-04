function displayValue(tag) {
  if (tag === null || tag === undefined) return "";
  if (typeof tag === "object") {
    if ("description" in tag) return String(tag.description);
    if ("value" in tag) {
      const value = tag.value;
      return Array.isArray(value) ? value.join(", ") : String(value);
    }
    return JSON.stringify(tag);
  }
  return String(tag);
}

const groups = [
  {
    title: "File",
    icon: "bi-file-earmark-image",
    match: (name) =>
      /Image Width|Image Height|File Type|File Size|Mime|Color Type|Bits Per Sample|Compression|Interlace/i.test(name),
  },
  {
    title: "Camera",
    icon: "bi-camera",
    match: (name) =>
      /Make|Model|Lens|Camera|Body/i.test(name),
  },
  {
    title: "Date & Time",
    icon: "bi-calendar3",
    match: (name) =>
      /Date|Time/i.test(name),
  },
  {
    title: "GPS",
    icon: "bi-geo-alt",
    match: (name) =>
      /GPS|Latitude|Longitude|Altitude|Location/i.test(name),
  },
  {
    title: "Camera Settings",
    icon: "bi-sliders",
    match: (name) =>
      /ISO|Exposure|FNumber|F-Number|Focal|Flash|White Balance|Metering|Shutter|Aperture|Orientation/i.test(name),
  },
  {
    title: "Software",
    icon: "bi-code-square",
    match: (name) =>
      /Software|Firmware|Creator|Artist|Author/i.test(name),
  },
];

function MetadataViewer({ metadata }) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <div className="alert alert-secondary small mb-0">
        No readable metadata found.
      </div>
    );
  }

  const used = new Set();
  const sections = groups.map((group) => {
    const entries = Object.entries(metadata).filter(([name]) => {
      if (used.has(name)) return false;
      if (!group.match(name)) return false;
      used.add(name);
      return true;
    });

    return { ...group, entries };
  });

  const otherEntries = Object.entries(metadata).filter(([name]) => !used.has(name));

  return (
    <div className="d-grid gap-2">
      {sections
        .filter((section) => section.entries.length > 0)
        .map((section) => (
          <details key={section.title} className="border rounded">
            <summary className="p-2 small fw-semibold">
              <i className={`bi ${section.icon} me-2`}></i>
              {section.title}
              <span className="badge text-bg-secondary ms-2">
                {section.entries.length}
              </span>
            </summary>
            <div className="border-top">
              {section.entries.map(([name, tag]) => (
                <div
                  key={name}
                  className="d-flex justify-content-between gap-3 px-2 py-2 border-bottom small"
                >
                  <span className="text-secondary">{name}</span>
                  <span className="text-end text-break">{displayValue(tag)}</span>
                </div>
              ))}
            </div>
          </details>
        ))}

      {otherEntries.length > 0 && (
        <details className="border rounded">
          <summary className="p-2 small fw-semibold">
            <i className="bi bi-three-dots me-2"></i>
            Other
            <span className="badge text-bg-secondary ms-2">
              {otherEntries.length}
            </span>
          </summary>
          <div className="border-top">
            {otherEntries.map(([name, tag]) => (
              <div
                key={name}
                className="d-flex justify-content-between gap-3 px-2 py-2 border-bottom small"
              >
                <span className="text-secondary">{name}</span>
                <span className="text-end text-break">{displayValue(tag)}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export default MetadataViewer;
