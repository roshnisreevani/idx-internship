import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';

function ListingsPage() { 

  // stores all the properties
  const [properties, setProperties] = useState([]);

  // shows loading while data is being fetched
  const [loading, setLoading] = useState(true);

  // stores any error message
  const [error, setError] = useState(null);

  // stores the total number of properties
  const [total, setTotal] = useState(0);

  //React will load properties when the page opens
  useEffect(() => {
    loadProperties();
  }, []);

  // get properties from the backend
  //updated to accept filters from the search form instead of loading every property 
  async function loadProperties(filters = {}) {
  try {
    setLoading(true);
    setError(null);

    const data = await fetchProperties({
      limit: 20,
      offset: 0,
      ...filters //returns only matching properties based on the filters selected by the user
    });

    setProperties(data.results);
    setTotal(data.total);

  } catch (err) {
    setError("Failed to load properties.");

  } finally {
    setLoading(false);
  }
}

   
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
      <PropertyFilters onSearch={loadProperties} />
    </div>

<p className="property-count">
  Showing {properties.length} of {total} properties
</p>

    <div className="property-grid">
  {properties.map(property => ( //creates a card for each property in the list
    <PropertyCard
      key={property.L_ListingID}
      property={property}
    />
  ))}
</div>

  </div>
);
function PropertyCard({ property }) { //displays one property card with its details
  return (
        <div className="property-card">

          <div className="property-image">
  {property.L_Photos ? (
    <>
      <img
        src={JSON.parse(property.L_Photos)[0]}
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
    </>
  ) : (
    <div className="no-image">
      No Image
    </div>
  )}
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