import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from '../components/PropertyImageCarousel';

//accept filters instead of reloading every time
function ListingsPage() { 

  // stores all the properties
  const [properties, setProperties] = useState([]);

  // shows loading while data is being fetched
  const [loading, setLoading] = useState(true);

  // stores any error message
  const [error, setError] = useState(null);

  // stores the total number of properties
  const [total, setTotal] = useState(0);


  //Week 7 New Work:allows users to search for properties 
  // based on specific criteria. 
  const [filters, setFilters] = useState({});

  // keeps track of the current page
  const [currentPage, setCurrentPage] = useState(1);

  // number of properties shown per page
  const [itemsPerPage] = useState(20);

  // reload properties whenever the filters or page changes
  useEffect(() => {
    loadProperties();
  }, [filters, currentPage]);

  // get properties from the backend
  //updated to accept filters from the search form instead of loading every property 
  async function loadProperties() {
  try {
    setLoading(true);
    setError(null);

    // calculate where this page should start
    const offset = (currentPage - 1) * itemsPerPage;

    // send the filters and pagination to the backend
    const data = await fetchProperties({
      ...filters,
      limit: itemsPerPage,
      offset
    });

    setProperties(data.results);
    setTotal(data.total);

  } catch (err) {
    setError("Failed to load properties.");

  } finally {
    setLoading(false);
  }
}

//helper functions: when user performs new search:
// update the filters and go back to the first page
const handleSearch = (newFilters) => {
  setFilters(newFilters);
  setCurrentPage(1);
};

//changes page number
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);

  // scroll back to the top of the page after changing pages
  window.scrollTo(0, 0);
};

// calculate the total number of pages
const totalPages = Math.ceil(total / itemsPerPage);

   
  if (loading) {
  return <div className="loading">Loading properties...</div>;
}

if (error) {
  return <div className="error">{error}</div>;
}

return (
  <div className="listings-page">

    <div className="hero-section">
      <h1>Find your perfect home</h1>
      <p>Search by city, price, bedrooms, and more.</p>
    </div>

    <div className="search-container">
      {/* connected filter component to the ListingsPage  */}
      <PropertyFilters onSearch={handleSearch} />
    </div>

{!loading && !error && (
  <p className="property-count">
    Showing {((currentPage - 1) * itemsPerPage) + 1} -
    {Math.min(currentPage * itemsPerPage, total)} of {total} properties
  </p>
)}

    <div className="property-grid">
  {properties.map(property => ( //creates a card for each property in the list
    <PropertyCard
      key={property.L_ListingID}
      property={property}
    />
  ))}
</div>

{!loading && !error && properties.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
)}


  </div>
);


function PropertyCard({ property }) {
  //Week 8: navigate to the property detail page when a card is clicked
  const navigate = useNavigate();

  //display the property image carousel, price, address, city, state, number of bedrooms, bathrooms, and square footage
  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  return (
    <div className="property-card" onClick={handleClick}>

    <div className="property-image">
        {/* display multiple photos of a property */}      <PropertyImageCarousel
        photos={property.L_Photos ? JSON.parse(property.L_Photos) : []}
        alt={property.L_Address}
      />

      <div className="image-overlay">
        <div className="price">
          ${property.L_SystemPrice?.toLocaleString()}
        </div>

        <div className="address">
          {property.L_Address}
        </div>

        <div className="city">
          {property.L_City}, {property.L_State}
        </div>
      </div>
    </div>

<div className="property-info">

  <div className="property-details">

         
          <span>{property.L_Keyword2} beds</span>
          <span>•</span>
          <span>{property.LM_Dec_3} baths</span>

          {property.LM_Int2_3 && (
            <>
              <span>•</span>
              <span>{property.LM_Int2_3.toLocaleString()} sqft</span>
            </>
          )}
        </div>

      </div>

    </div>
    
  );
}
}

export default ListingsPage;