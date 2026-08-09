import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import './PropertyDetailPage.css';

function PropertyDetailPage() {
  // get the property ID from the URL
  const { id } = useParams();

  // lets us navigate back to the listings page
  const navigate = useNavigate();

  // stores the selected property
  const [property, setProperty] = useState(null);

  // stores the open houses for this property
  const [openHouses, setOpenHouses] = useState([]);

  // shows loading while the property is being fetched
  const [loading, setLoading] = useState(true);

  // stores any error message
  const [error, setError] = useState(null);

  // load the property whenever the ID in the URL changes
  useEffect(() => {
    loadProperty();
  }, [id]);

  // fetch the property and its open houses
  async function loadProperty() {
    try {
      setLoading(true);
      setError(null);

      // get the selected property from the backend
      const data = await fetchPropertyDetail(id);
      setProperty(data);

      // get any open houses for this property
      const houses = await fetchOpenHouses(id);
      setOpenHouses(houses);

    } catch (err) {
      setError('Failed to load property.');
    } finally {
      setLoading(false);
    }
  }

  // show loading message while data is being fetched
  if (loading) {
    return <div className="loading">Loading property...</div>;
  }

  // show an error message if the property could not be loaded
  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>

        <button onClick={() => navigate('/')}>
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail-page">

      {/* button to return to the listings page */}
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Listings
      </button>

      <div className="property-detail">

        <div className="property-main">

          {/* display the property's first photo */}
          {property.L_Photos && (
            <img
              className="property-detail-image"
              src={JSON.parse(property.L_Photos)[0]}
              alt={property.L_Address}
            />
          )}

          {/* property price */}
          <h1>
            ${property.L_SystemPrice?.toLocaleString()}
          </h1>

          {/* property address */}
          <h2>{property.L_Address}</h2>

          <p>
            {property.L_City}, {property.L_State}
          </p>

          {/* bedrooms, bathrooms, and square footage */}
          <div className="property-detail-info">
            <span>{property.L_Keyword2} beds</span>

            <span>{property.LM_Dec_3} baths</span>

            {property.LM_Int2_3 && (
              <span>
                {property.LM_Int2_3.toLocaleString()} sqft
              </span>
            )}
          </div>

          {/* year built, if available */}
          {property.LM_Int1_1 && (
            <p>
              Year Built: {property.LM_Int1_1}
            </p>
          )}

          {/* property description, if available */}
          {property.L_Remarks && (
            <div className="property-description">
              <h3>Description</h3>
              <p>{property.L_Remarks}</p>
            </div>
          )}

          {/* open house information */}
          <div className="open-houses">
            <h3>Open Houses</h3>

            {openHouses.length > 0 ? (
              openHouses.map((house, index) => (
                <div className="open-house" key={index}>
                  <p>{house.date}</p>
                  <p>{house.startTime} - {house.endTime}</p>
                </div>
              ))
            ) : (
              <p>No upcoming open houses.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default PropertyDetailPage;