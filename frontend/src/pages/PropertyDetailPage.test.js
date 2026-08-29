import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PropertyDetailPage from './PropertyDetailPage';
import {
  fetchPropertyDetail,
  fetchOpenHouses
} from '../api/client';

jest.mock('../api/client', () => ({
  fetchPropertyDetail: jest.fn(),
  fetchOpenHouses: jest.fn()
}));

const mockProperty = {
  L_ListingID: '12345',
  L_SystemPrice: 450000,
  L_Address: '123 Main Street',
  L_City: 'Chicago',
  L_State: 'IL',
  L_Keyword2: 3,
  LM_Dec_3: 2,
  LM_Int2_3: 1800,
  LM_Int1_1: 2015,
  L_Remarks: 'Beautiful home in a great neighborhood.',
  L_Photos: JSON.stringify([
    'https://example.com/property.jpg'
  ])
};

function renderPropertyDetailPage() {
  return render(
    <MemoryRouter initialEntries={['/property/12345']}>
      <Routes>
        <Route
          path="/property/:id"
          element={<PropertyDetailPage />}
        />

        <Route
          path="/"
          element={<div>Listings Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('PropertyDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fetchPropertyDetail.mockResolvedValue(mockProperty);
    fetchOpenHouses.mockResolvedValue([]);
  });

  test('shows loading message while property is loading', () => {
    fetchPropertyDetail.mockImplementation(
      () => new Promise(() => {})
    );

    renderPropertyDetailPage();

    expect(
      screen.getByText('Loading property...')
    ).toBeInTheDocument();
  });

  test('renders property information after loading', async () => {
    renderPropertyDetailPage();

    expect(
      await screen.findByText('$450,000')
    ).toBeInTheDocument();

    expect(
      screen.getByText('123 Main Street')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Chicago, IL')
    ).toBeInTheDocument();

    expect(
      screen.getByText('3 beds')
    ).toBeInTheDocument();

    expect(
      screen.getByText('2 baths')
    ).toBeInTheDocument();

    expect(
      screen.getByText('1,800 sqft')
    ).toBeInTheDocument();
  });

  test('renders the property image', async () => {
    renderPropertyDetailPage();

    const image = await screen.findByAltText(
      '123 Main Street'
    );

    expect(image).toHaveAttribute(
      'src',
      'https://example.com/property.jpg'
    );
  });

  test('renders optional property information', async () => {
    renderPropertyDetailPage();

    await screen.findByText('$450,000');

    expect(
      screen.getByText('Year Built: 2015')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Description')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Beautiful home in a great neighborhood.'
      )
    ).toBeInTheDocument();
  });

  test('renders open houses when available', async () => {
    fetchOpenHouses.mockResolvedValue([
      {
        date: 'August 30, 2026',
        startTime: '12:00 PM',
        endTime: '2:00 PM'
      },
      {
        date: 'August 31, 2026',
        startTime: '1:00 PM',
        endTime: '3:00 PM'
      }
    ]);

    renderPropertyDetailPage();

    expect(
      await screen.findByText('August 30, 2026')
    ).toBeInTheDocument();

    expect(
      screen.getByText('12:00 PM - 2:00 PM')
    ).toBeInTheDocument();

    expect(
      screen.getByText('August 31, 2026')
    ).toBeInTheDocument();

    expect(
      screen.getByText('1:00 PM - 3:00 PM')
    ).toBeInTheDocument();
  });

  test('shows message when there are no open houses', async () => {
    renderPropertyDetailPage();

    expect(
      await screen.findByText('No upcoming open houses.')
    ).toBeInTheDocument();
  });

  test('shows an error message when the property fails to load', async () => {
    fetchPropertyDetail.mockRejectedValue(
      new Error('Property not found')
    );

    renderPropertyDetailPage();

    expect(
      await screen.findByText('Failed to load property.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /back to listings/i
      })
    ).toBeInTheDocument();
  });

  test('navigates back to listings when back button is clicked', async () => {
    renderPropertyDetailPage();

    const button = await screen.findByRole(
      'button',
      {
        name: /back to listings/i
      }
    );

    fireEvent.click(button);

    expect(
      await screen.findByText('Listings Page')
    ).toBeInTheDocument();
  });

  test('does not show optional information when it is unavailable', async () => {
    fetchPropertyDetail.mockResolvedValue({
      ...mockProperty,
      LM_Int2_3: null,
      LM_Int1_1: null,
      L_Remarks: null,
      L_Photos: null
    });

    renderPropertyDetailPage();

    await screen.findByText('$450,000');

    expect(
      screen.queryByText(/sqft/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/Year Built/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText('Description')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByAltText('123 Main Street')
    ).not.toBeInTheDocument();
  });
});