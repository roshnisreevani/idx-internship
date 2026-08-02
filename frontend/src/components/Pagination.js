

import React from 'react';
import './Pagination.css';

// pagination controls to navigate between pages
function Pagination({ currentPage, totalPages, onPageChange }) {

  // check if the user can move backward or forward
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // go to the previous page
  const handlePrevious = () => {
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  // go to the next page
  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  // only show pagination if there is more than one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">

      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={!canGoPrev}
      >
        ← Previous
      </button>

      <span className="page-number">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={!canGoNext}
      >
        Next →
      </button>

    </div>
  );
}

export default Pagination;