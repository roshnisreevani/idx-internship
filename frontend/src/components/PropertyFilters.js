import React, { useState } from 'react';
import './PropertyFilters.css';



function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState({ //to store all the users search filters
    city: '',
    beds: '',
    baths: '',
    maxPrice: ''
  });

  // updates the filter as the user types
  function handleChange(event) {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  }

  // sends the filters back to ListingsPage when button is clicked
  function handleSubmit(event) {
    event.preventDefault();

    if (onSearch) { //run the search from the selected filters
      onSearch(filters);
    }
  }

  return (
    <form className="filter-form" onSubmit={handleSubmit}>

      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />

      <input
        type="number"
        name="beds"
        placeholder="Beds"
        value={filters.beds}
        onChange={handleChange}
      />

      <input
        type="number"
        name="baths"
        placeholder="Baths"
        value={filters.baths}
        onChange={handleChange}
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <button type="submit">
         Search
      </button>

    </form>
  );
}

export default PropertyFilters;