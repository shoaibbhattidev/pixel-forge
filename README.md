# Pixel Forge

> Privacy-first, browser-based image resizer, compressor, converter, and optimizer.

Pixel Forge is a modern React + Vite web application for resizing, compressing, converting, and optimizing images **directly in the browser**. Images do not need to be uploaded to a processing server.

## ✨ Features

### 🖼️ Image Input
- Drag-and-drop image upload
- Multi-image selection
- Supports **JPEG, PNG, WebP, and AVIF**
- Duplicate-image detection
- Client-side validation
- Maximum input size: **20 MB per image**
- Instant local previews

### 📐 Resize Controls
- Custom width and height
- Automatic dimension detection
- Lock aspect ratio
- Multiple resize modes:
  - Fit
  - Fill
  - Crop
  - Stretch
- Per-image resize settings

### 📱 Social Media Presets
Built-in presets for common platforms:
- **Instagram:** profile, square post, portrait post, story, reel cover
- **Facebook:** profile, post, story, cover
- **TikTok:** profile, post/cover
- **YouTube:** profile, thumbnail, channel banner
- **WhatsApp:** profile, status
- **Discord:** profile, server icon, server banner
- **X:** profile, post, header
- **LinkedIn:** profile, post, page logo, page cover
- **Pinterest:** profile, pin
- **Telegram:** profile, story
- **General:** square, HD landscape, HD portrait

Presets automatically apply recommended dimensions, format, and quality.

### 🔄 Format Conversion
Convert images to:
- WebP
- JPEG
- PNG
- AVIF

### 🎚️ Compression & Quality
- Adjustable quality from **1–100%**
- Optional target file size
- Target size units: KB or MB
- Automatic target-size optimization
- Per-image quality settings

### 🏷️ Metadata
- View image metadata
- Metadata categories include file, camera, date/time, GPS, camera settings, software, and other information
- Metadata modes:
  - **Preserve**
  - **Remove**
  - **Custom**
- Custom JPEG EXIF fields include author, copyright, software, camera, lens, date/time, GPS, altitude, ISO, exposure, f-number, and focal length
- Metadata behavior depends on browser and output format

### 📦 Batch Processing
- Optimize multiple images
- **Optimize All** with individual settings per image
- Batch progress indicator
- Per-image processing status
- Download all optimized images as a ZIP
- Download optimized images individually
- Safe object-URL cleanup

### 📊 Optimization Results
For each optimized image Pixel Forge shows:
- Original size
- Optimized size
- Bytes saved
- Percentage reduction
- Optimized preview
- Output format
- Processing status

### 🎨 UI & Theme
- Responsive Bootstrap interface
- Bootstrap Icons
- Tailwind CSS available for utility styling
- Light mode
- Dark mode
- Animated pill-style theme toggle
- Dark theme uses black/deep-blue glass styling with green accents
- Theme preference persists after refresh
- Accessible focus states
- Reduced-motion support
- Responsive mobile layout
- Privacy/local-processing indicators

### 🔒 Privacy First
Pixel Forge follows a local-first architecture:
- Core image processing runs in the browser
- No image-processing backend is required
- Images are not intentionally uploaded for optimization
- Suitable for private images where local processing is preferred

> Browser behavior, deployed hosting, and third-party dependencies should always be reviewed separately for highly sensitive data.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and application architecture |
| Vite 8 | Development and production build |
| Bootstrap 5 | Layout and UI |
| Bootstrap Icons | Interface icons |
| Tailwind CSS 4 | Utility styling |
| JSZip | ZIP archive generation |
| ExifReader | Metadata reading |
| piexifjs | JPEG EXIF handling |
| OxiPNG | PNG optimization |
| @jsquash/avif | AVIF encoding |
| React Compiler/Babel tooling | React build optimization |

## 🚀 Getting Started

### Requirements
- Node.js
- npm
- Modern browser with JavaScript enabled

### Install

```bash
git clone https://github.com/shoaibbhattidev/pixel-forge.git
cd pixel-forge
npm install
```

### Development

```bash
npm run dev
```

Open the local URL displayed by Vite.

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

The production output is generated in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## ☁️ Deployment

Pixel Forge is a static/client-side Vite application and can be deployed to services such as Vercel.

Typical Vercel settings:

| Setting | Value |
|---|---|
| Framework | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | None required |

No API keys or database environment variables are required for the core application.

## 🧠 Processing Flow

```text
Select / Drop Images
        ↓
Validate Format + Size
        ↓
Create Local Preview
        ↓
Configure Image
        ↓
Resize / Crop / Fit / Fill / Stretch
        ↓
Convert Format
        ↓
Compress / Target Size
        ↓
Apply Metadata Rules
        ↓
Generate Optimized Image
        ↓
Preview + Statistics
        ↓
Download Individually or ZIP
```

## 📁 Project Structure

```text
pixel-forge/
├── public/
├── src/
│   ├── components/
│   │   ├── DropZone.jsx
│   │   ├── Header.jsx
│   │   ├── ImageCard.jsx
│   │   ├── ImageGrid.jsx
│   │   ├── MetadataPanel.jsx
│   │   ├── MetadataViewer.jsx
│   │   └── Toast.jsx
│   ├── hooks/
│   │   └── useImageSettings.js
│   ├── utils/
│   │   ├── imageProcessor.js
│   │   ├── imagePresets.js
│   │   ├── metadataProcessor.js
│   │   ├── validateImage.js
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── ci.yml
├── index.html
├── LICENSE
├── package.json
└── README.md
```

## 🔐 Metadata Support

| Format | Read | Preserve | Remove | Custom |
|---|---:|---:|---:|---:|
| JPEG | ✅ | ✅* | ✅ | ✅* |
| PNG | ✅ | — | ✅ | — |
| WebP | ✅ | — | ✅ | — |
| AVIF | Depends on source | — | ✅ | — |

* JPEG EXIF preservation/writing is supported where the current processing path allows it.

Canvas/browser encoding can discard metadata during format conversion, so Pixel Forge does not promise metadata preservation when the browser encoder cannot reliably retain it.

## ♿ Accessibility & UX

- Semantic buttons and labels
- Accessible theme control
- Keyboard focus states
- Screen-reader-friendly status/notification areas
- Reduced-motion support
- Responsive controls for smaller screens
- Processing buttons are disabled while an image is being processed

## 🛡️ Validation & Safety

- Unsupported file types are rejected
- Files above 20 MB are rejected
- Duplicate files are detected in the current session
- Processing errors are surfaced to the user
- Object URLs are cleaned up to reduce browser memory usage

## 🗺️ Roadmap

Possible future improvements:
- More advanced metadata support for additional formats
- More compression controls
- More presets
- Additional export options
- Improved performance for very large images
- More accessibility refinements
- Optional advanced editing tools

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Open a pull request.

## 🐛 Bug Reports

When reporting a bug, include:
- Browser and version
- Operating system
- Input image format
- Output format
- Image dimensions/file size
- Selected settings
- Steps to reproduce
- Console/build error if available

## 📄 License

Pixel Forge is open-source software licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, subject to the conditions of the MIT License.

The full license text is available in the [LICENSE](LICENSE) file.

**Copyright © 2026 Shoaib Bhatti.**

---

**Pixel Forge — powerful image optimization, directly in your browser.**
