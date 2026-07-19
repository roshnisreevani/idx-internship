import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
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
  async function loadProperties() {
    try {

      setLoading(true);
      setError(null);

      const data = await fetchProperties({
        //asks backend for properties 
        limit: 20,
        offset: 0
      });

      setProperties(data.results); //Once data comes back, save properties
      setTotal(data.total); //save total number of properties

    } catch (err) { //show error if something went wrong

      setError('Failed to load properties.');

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

    <h1>Property Listings</h1>

    <p>
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
        <img
          src={JSON.parse(property.L_Photos)[0]}
          alt={property.L_Address}
        />
        ) : (
        <div className="no-image">
          No Image
        </div>
      )}
      </div>

        <div className="property-info">

        <div className="price">
          ${property.L_SystemPrice?.toLocaleString()}
        </div>

        <div className="address">
          {property.L_Address}
        </div>

        <div className="city">
          {property.L_City}, {property.L_State}
        </div>

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