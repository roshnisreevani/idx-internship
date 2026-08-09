import React, { useState } from 'react';
import './PropertyImageCarousel.css';

function PropertyImageCarousel({ photos, alt = 'Property' }) {
    //keeps track of which photo is currrently displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  //shows a placeholder if a property has no photos 
  if (!photos || photos.length === 0) {
    return (
      <div className="carousel-no-image">
        No Image
      </div>
    );
  }

  //go to previous photo 
const goToPrevious = (event) => {
  event.stopPropagation();

  setCurrentIndex(
    currentIndex === 0 ? photos.length - 1 : currentIndex - 1
  );
};


//ho to next photo 
const goToNext = (event) => {
  event.stopPropagation();

  setCurrentIndex(
    currentIndex === photos.length - 1 ? 0 : currentIndex + 1
  );
};

  return (
    <div className="property-carousel">
      <img
        src={photos[currentIndex]}
        alt={alt}
        className="carousel-image"
      />

      {photos.length > 1 && (
        <>
          <button
            className="carousel-button carousel-prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            className="carousel-button carousel-next"
            onClick={goToNext}
            aria-label="Next image"
          >
            →
          </button>

          <div className="carousel-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;