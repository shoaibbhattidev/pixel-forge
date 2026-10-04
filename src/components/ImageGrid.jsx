import ImageCard from "./ImageCard";

function ImageGrid({ images, onRemove, onOptimize, onSettingsChange }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="row g-4">
        {images.map((image) => (
          <div className="col-12 col-md-6 col-lg-4" key={image.id}>
            <ImageCard
              image={image}
              onRemove={onRemove}
              onOptimize={onOptimize}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImageGrid;
