//file is responsible for making API calls to the backend. It connects the backend to the frontend.
const API_BASE = '';

// asks for backend for a list of properties
export async function fetchProperties(params = {}) {
  try {
    //turn filters into URL parameters
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/api/properties${query ? '?' + query : ''}`;

    //send a request to the backend 
    const response = await fetch(url);

    if (!response.ok) {
        //so if backend returns an error, stop the function
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    //convert the response to JSON and return it
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// fetch one property
export async function fetchPropertyDetail(listingId) {
  try {
    const response = await fetch(`${API_BASE}/api/properties/${listingId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Property not found');
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// fetch open houses
export async function fetchOpenHouses(listingId) {
  try {
    const response = await fetch(
      `${API_BASE}/api/properties/${listingId}/openhouses`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}