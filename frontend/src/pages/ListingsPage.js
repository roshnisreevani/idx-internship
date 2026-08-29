import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from '../components/PropertyImageCarousel';
import PropertyCard from '../components/PropertyCard';

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

  //Week 9: let users sort properties by price, date, size, or beds
  const [sortBy, setSortBy] = useState('');

  // direction of the sort, either ASC or DESC
  const [sortOrder, setSortOrder] = useState('ASC');

  // reload properties whenever the filters, page, or sorting changes
  useEffect(() => {
    loadProperties();
  }, [filters, currentPage, sortBy, sortOrder]);

  // get properties from the backend
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
        offset,
        ...(sortBy && { sortBy, sortOrder })
      });

      setProperties(data.results);
      setTotal(data.total);

    } catch (err) {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }

  // update the filters and go back to the first page
  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // changes page number
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // default sort direction for each field
  const defaultSortOrders = {
    L_SystemPrice: 'ASC',
    ListingContractDate: 'DESC',
    LM_Int2_3: 'ASC',
    L_Keyword2: 'DESC'
  };

  // labels for each sort direction
  const sortOrderLabels = {
    L_SystemPrice: { ASC: 'Lowest price', DESC: 'Highest price' },
    ListingContractDate: { ASC: 'Oldest listings', DESC: 'Newest listings' },
    LM_Int2_3: { ASC: 'Smallest homes', DESC: 'Largest homes' },
    L_Keyword2: { ASC: 'Fewest beds', DESC: 'Most beds' }
  };

  // change sorting field
  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setSortOrder(defaultSortOrders[newSortBy] || 'ASC');
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
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
        <PropertyFilters onSearch={handleSearch} />
      </div>

      <div className="sort-controls">
        <label htmlFor="sort-by">Sort by:</label>

        <select
          id="sort-by"
          value={sortBy}
          onChange={handleSortByChange}
        >
          <option value="">Default</option>
          <option value="L_SystemPrice">Price</option>
          <option value="ListingContractDate">Date Listed</option>
          <option value="LM_Int2_3">Size</option>
          <option value="L_Keyword2">Bedrooms</option>
        </select>

        {sortBy && (
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="ASC">
              {sortOrderLabels[sortBy].ASC}
            </option>
            <option value="DESC">
              {sortOrderLabels[sortBy].DESC}
            </option>
          </select>
        )}
      </div>

      <p className="property-count">
         Showing {((currentPage - 1) * itemsPerPage) + 1} -{' '}
        {Math.min(currentPage * itemsPerPage, total)} of {total} properties
      </p>

      <div className="property-grid">
        {properties.map(property => (
          <PropertyCard
            key={property.L_ListingID}
            property={property}
          />
        ))}
      </div>

      {properties.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}

export default ListingsPage;