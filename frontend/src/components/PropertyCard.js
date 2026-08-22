import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';
import './PropertyCard.css';
import PropTypes from 'prop-types';

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  return (
    <div className="property-card" onClick={handleClick}>

      <div className="property-image">
        <PropertyImageCarousel
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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.string.isRequired,
    L_SystemPrice: PropTypes.number,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Keyword2: PropTypes.number,
    LM_Dec_3: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    LM_Int2_3: PropTypes.number,
    L_Photos: PropTypes.string
  }).isRequired
};

export default PropertyCard;