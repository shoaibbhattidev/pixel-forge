# Pixel Forge

> A fast, privacy-first image optimizer built for the modern web.

**Pixel Forge** lets you resize, compress, convert, and optimize images directly in your browser — without uploading your images to a server.

Built with React and Vite, Pixel Forge is designed to make image optimization simple, fast, and practical for everyday use.

---

## ✨ Features

### 🖼️ Image Optimization
- Resize images to custom dimensions
- Preserve aspect ratio when needed
- Multiple resize modes
- Compress images with adjustable quality
- Optimize multiple images in one session
- Optimize every image independently

### 🔄 Format Conversion
Convert images between common modern formats:

- WebP
- JPEG
- PNG
- AVIF

### 🎯 Target File Size
Set a target output size in:

- KB
- MB

Pixel Forge automatically searches for an appropriate quality level when the selected encoder supports quality-based compression.

### 🧩 Per-Image Settings
Every image has its own independent configuration.

You can configure different images with different:
- Dimensions
- Resize modes
- Output formats
- Quality levels
- Target sizes
- Metadata settings

Then use **Optimize All** to process them using their individual settings.

### 🏷️ Metadata Tools

Pixel Forge includes metadata inspection and control.

#### View Metadata
Metadata is organized into readable categories:

- File
- Camera
- Date & Time
- GPS
- Camera Settings
- Software
- Other

#### Metadata Modes

**Preserve**
- Preserves supported JPEG EXIF metadata when exporting JPEG to JPEG.

**Remove**
- Produces a clean browser-generated image without the original metadata.

**Custom**
- Add your own supported JPEG EXIF information.
- Camera make and model
- Lens
- Software
- Author
- Copyright
- Capture date/time
- GPS coordinates
- Altitude
- ISO
- Exposure time
- F-number
- Focal length

Empty fields are ignored.

> Metadata support depends on the output format and browser encoding capabilities.

### 📦 Batch Download
Download all optimized images together as a ZIP archive.

### 🔒 Privacy First

Images are processed locally in the browser.

**Your images do not need to be uploaded to a backend server for optimization.**

This makes Pixel Forge useful for:
- Personal photos
- Screenshots
- Product images
- Website assets
- Social media images
- Documents and graphics

### ⚡ Modern Client-Side Processing
Pixel Forge uses browser-side processing and modern image codecs/libraries, including:

- React
- Vite
- Bootstrap
- Tailwind CSS
- JSZip
- ExifReader
- piexifjs
- OxiPNG
- WebAssembly-based AVIF encoding

---

## 🚀 Getting Started

### Requirements

- Node.js
- npm
- A modern browser

### Installation

Clone the repository:

```bash
git clone https://github.com/shoaibbhattidev/pixel-forge.git
cd pixel-forge
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

---

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
pixel-forge/
├── public/
├── src/
│   ├── components/
│   │   ├── ImageCard.jsx
│   │   ├── ImageGrid.jsx
│   │   ├── MetadataPanel.jsx
│   │   ├── MetadataViewer.jsx
│   │   └── ...
│   ├── hooks/
│   │   └── useImageSettings.js
│   ├── utils/
│   │   ├── imageProcessor.js
│   │   ├── metadataProcessor.js
│   │   ├── imagePresets.js
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

---

## 🧠 How It Works

Pixel Forge follows a client-side processing pipeline:

```text
Select Images
     ↓
Validate
     ↓
Preview
     ↓
Configure Each Image
     ↓
Resize / Convert / Compress
     ↓
Apply Metadata Rules
     ↓
Generate Optimized File
     ↓
Download Individually or as ZIP
```

No server-side image-processing API is required for the core workflow.

---

## 🎯 Project Goals

Pixel Forge is being developed around a few simple principles:

- **Privacy** — process images locally whenever possible.
- **Speed** — avoid unnecessary server uploads.
- **Control** — give users detailed per-image settings.
- **Quality** — provide useful compression without forcing one configuration.
- **Simplicity** — keep the workflow understandable.
- **Modern formats** — support efficient formats such as WebP and AVIF.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | UI and application architecture |
| Vite | Development and production tooling |
| Bootstrap | UI components and layout |
| Tailwind CSS | Utility styling |
| JSZip | ZIP downloads |
| ExifReader | Metadata reading |
| piexifjs | JPEG EXIF writing |
| OxiPNG | PNG optimization |
| @jsquash/avif | AVIF encoding |

---

## 📌 Current Metadata Support

Metadata handling varies by output format.

| Format | Read | Preserve | Remove | Custom |
|---|---:|---:|---:|---:|
| JPEG | ✅ | ✅* | ✅ | ✅* |
| PNG | ✅ | — | ✅ | — |
| WebP | ✅ | — | ✅ | — |
| AVIF | Depends on source | — | ✅ | — |

\* JPEG EXIF writing/preservation is supported for JPEG output.

Canvas/browser encoding can discard source metadata when converting between formats. Pixel Forge therefore does not claim metadata preservation where the browser's encoder cannot reliably provide it.

---

## 🔐 Privacy

Pixel Forge is designed with a local-first architecture.

The core image workflow does not require uploading image files to a remote processing server.

Always review the behavior of the deployed version and browser environment before using the application for highly sensitive material.

---

## 🗺️ Roadmap

Planned improvements may include:

- [ ] More advanced metadata writing across additional formats
- [ ] More compression controls
- [ ] Improved metadata editing
- [ ] Additional image presets
- [ ] Better progress reporting
- [ ] Additional export options
- [ ] UI and accessibility improvements
- [ ] Performance improvements for very large images

The roadmap is intentionally flexible and may change as Pixel Forge evolves.

---

## 🤝 Contributing

Contributions, bug reports, ideas, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Open a pull request.

For larger changes, please describe the problem and proposed solution before submitting a major architectural change.

---

## 🐛 Bug Reports

When reporting a bug, include:

- Browser and version
- Operating system
- Input image format
- Output format
- Image dimensions/file size
- Selected optimization settings
- Steps to reproduce
- Console error, if available

This information makes image-processing issues much easier to reproduce.

---

## 📄 License

No license has currently been declared for this repository.

If you plan to distribute, modify, or reuse Pixel Forge, check the repository owner's licensing terms before doing so.

---

## ⭐ Support the Project

If Pixel Forge is useful to you:

- Star the repository
- Report bugs
- Suggest improvements
- Share the project

**Pixel Forge — powerful image optimization, directly in your browser.**
