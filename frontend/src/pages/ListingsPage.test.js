import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingsPage from './ListingsPage';
import { fetchProperties } from '../api/client';

jest.mock('../api/client', () => ({
fetchProperties: jest.fn()
}));

jest.mock('../components/PropertyFilters', () => {
return function PropertyFilters({ onSearch }) {
return (
<button
onClick={() =>
onSearch({
city: 'Chicago'
})
}
>
Search Chicago </button>
);
};
});

jest.mock('../components/PropertyCard', () => {
return function PropertyCard({ property }) {
return ( <div>
{property.L_Address} </div>
);
};
});

jest.mock('../components/Pagination', () => {
return function Pagination({
currentPage,
totalPages,
onPageChange
}) {
return ( <div> <p>
Page {currentPage} of {totalPages} </p>


    <button onClick={() => onPageChange(2)}>
      Go to page 2
    </button>
  </div>
);


};
});

const mockProperties = [
{
L_ListingID: '1',
L_Address: '123 Main Street'
},
{
L_ListingID: '2',
L_Address: '456 Oak Avenue'
}
];

function renderListingsPage() {
return render( <MemoryRouter> <ListingsPage /> </MemoryRouter>
);
}

beforeEach(() => {
fetchProperties.mockReset();

fetchProperties.mockResolvedValue({
results: mockProperties,
total: 25
});

window.scrollTo = jest.fn();
});

describe('ListingsPage', () => {
test('shows loading message initially', () => {
fetchProperties.mockImplementation(
() => new Promise(() => {})
);


renderListingsPage();

expect(
  screen.getByText('Loading properties...')
).toBeInTheDocument();


});

test('loads and displays properties', async () => {
renderListingsPage();


expect(
  await screen.findByText('123 Main Street')
).toBeInTheDocument();

expect(
  screen.getByText('456 Oak Avenue')
).toBeInTheDocument();

expect(
  document.querySelector('.property-count')
).toHaveTextContent(
  'Showing 1 - 20 of 25 properties'
);


});

test('shows an error when loading properties fails', async () => {
fetchProperties.mockRejectedValueOnce(
new Error('API Error')
);


renderListingsPage();

expect(
  await screen.findByText(
    'Failed to load properties.'
  )
).toBeInTheDocument();


});

test('fetches properties with pagination parameters', async () => {
renderListingsPage();


await waitFor(() => {
  expect(fetchProperties).toHaveBeenCalledWith({
    limit: 20,
    offset: 0
  });
});


});

test('updates filters and reloads properties', async () => {
renderListingsPage();


await screen.findByText('123 Main Street');

fireEvent.click(
  screen.getByText('Search Chicago')
);

await waitFor(() => {
  expect(fetchProperties).toHaveBeenLastCalledWith({
    city: 'Chicago',
    limit: 20,
    offset: 0
  });
});


});

test('changes to page 2 and fetches the correct offset', async () => {
renderListingsPage();


await screen.findByText('Go to page 2');

fireEvent.click(
  screen.getByText('Go to page 2')
);

await waitFor(() => {
  expect(fetchProperties).toHaveBeenLastCalledWith({
    limit: 20,
    offset: 20
  });
});

expect(window.scrollTo).toHaveBeenCalledWith(0, 0);


});

test('changes sorting by price and uses default ascending order', async () => {
renderListingsPage();


await screen.findByText('123 Main Street');

fireEvent.change(
  screen.getByLabelText('Sort by:'),
  {
    target: {
      value: 'L_SystemPrice'
    }
  }
);

expect(
  await screen.findByText('Lowest price')
).toBeInTheDocument();

expect(
  screen.getByText('Highest price')
).toBeInTheDocument();

await waitFor(() => {
  expect(fetchProperties).toHaveBeenLastCalledWith({
    limit: 20,
    offset: 0,
    sortBy: 'L_SystemPrice',
    sortOrder: 'ASC'
  });
});


});

test('changes sorting by date and uses default descending order', async () => {
renderListingsPage();


await screen.findByText('123 Main Street');

fireEvent.change(
  screen.getByLabelText('Sort by:'),
  {
    target: {
      value: 'ListingContractDate'
    }
  }
);

expect(
  await screen.findByText('Oldest listings')
).toBeInTheDocument();

expect(
  screen.getByText('Newest listings')
).toBeInTheDocument();

await waitFor(() => {
  expect(fetchProperties).toHaveBeenLastCalledWith({
    limit: 20,
    offset: 0,
    sortBy: 'ListingContractDate',
    sortOrder: 'DESC'
  });
});


});

test('allows the user to change sort order', async () => {
renderListingsPage();

await screen.findByText('123 Main Street');

fireEvent.change(
  screen.getByLabelText('Sort by:'),
  {
    target: {
      value: 'L_SystemPrice'
    }
  }
);

await screen.findByText('Lowest price');

const selects = screen.getAllByRole('combobox');

fireEvent.change(
  selects[1],
  {
    target: {
      value: 'DESC'
    }
  }
);

await waitFor(() => {
  expect(fetchProperties).toHaveBeenLastCalledWith({
    limit: 20,
    offset: 0,
    sortBy: 'L_SystemPrice',
    sortOrder: 'DESC'
  });
});


});

test('does not show pagination when there are no properties', async () => {
fetchProperties.mockResolvedValue({
results: [],
total: 0
});


renderListingsPage();

await waitFor(() => {
  expect(
    screen.queryByText(/Page 1 of/i)
  ).not.toBeInTheDocument();
});


});
});
