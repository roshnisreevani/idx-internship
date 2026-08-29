import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from './PropertyCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
...jest.requireActual('react-router-dom'),
useNavigate: () => mockNavigate
}));

const property = {
L_ListingID: '12345',
L_SystemPrice: 450000,
L_Address: '123 Main Street',
L_City: 'Chicago',
L_State: 'IL',
L_Keyword2: 3,
LM_Dec_3: 2,
LM_Int2_3: 1800,
L_Photos: JSON.stringify([
'https://example.com/property.jpg'
])
};

describe('PropertyCard', () => {
beforeEach(() => {
mockNavigate.mockClear();
});

test('renders property information', () => {
render(<PropertyCard property={property} />);


expect(screen.getByText('$450,000')).toBeInTheDocument();
expect(screen.getByText('123 Main Street')).toBeInTheDocument();
expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
expect(screen.getByText('3 beds')).toBeInTheDocument();
expect(screen.getByText('2 baths')).toBeInTheDocument();
expect(screen.getByText('1,800 sqft')).toBeInTheDocument();


});

test('navigates to the property detail page when clicked', () => {
const { container } = render( <PropertyCard property={property} />
);


fireEvent.click(
  container.querySelector('.property-card')
);

expect(mockNavigate).toHaveBeenCalledWith(
  '/property/12345'
);


});

test('does not show square footage when it is not available', () => {
const propertyWithoutSqft = {
...property,
LM_Int2_3: null
};


render(
  <PropertyCard property={propertyWithoutSqft} />
);

expect(
  screen.queryByText(/sqft/i)
).not.toBeInTheDocument();


});

test('renders without photos', () => {
const propertyWithoutPhotos = {
...property,
L_Photos: null
};


render(
  <PropertyCard property={propertyWithoutPhotos} />
);

expect(
  screen.getByText('No Image')
).toBeInTheDocument();


});

test('formats the property price with commas', () => {
const expensiveProperty = {
...property,
L_SystemPrice: 1250000
};


render(
  <PropertyCard property={expensiveProperty} />
);

expect(
  screen.getByText('$1,250,000')
).toBeInTheDocument();


});
});
