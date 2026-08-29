import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
  test('renders all filter inputs and search button', () => {
    render(<PropertyFilters onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Beds')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Baths')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /search/i })
    ).toBeInTheDocument();
  });

  test('updates filter values when the user types', () => {
    render(<PropertyFilters onSearch={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'Beverly Hills' }
    });

    fireEvent.change(screen.getByPlaceholderText('Beds'), {
      target: { value: '3' }
    });

    fireEvent.change(screen.getByPlaceholderText('Baths'), {
      target: { value: '2' }
    });

    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { value: '500000' }
    });

    expect(screen.getByPlaceholderText('City')).toHaveValue('Beverly Hills');
    expect(screen.getByPlaceholderText('Beds')).toHaveValue(3);
    expect(screen.getByPlaceholderText('Baths')).toHaveValue(2);
    expect(screen.getByPlaceholderText('Max Price')).toHaveValue(500000);
  });

  test('calls onSearch with the selected filter values when submitted', () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'Beverly Hills' }
    });

    fireEvent.change(screen.getByPlaceholderText('Beds'), {
      target: { value: '3' }
    });

    fireEvent.change(screen.getByPlaceholderText('Baths'), {
      target: { value: '2' }
    });

    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { value: '500000' }
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith({
      city: 'Beverly Hills',
      beds: '3',
      baths: '2',
      maxPrice: '500000'
    });
  });

  test('submits empty filters when no values are entered', () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith({
      city: '',
      beds: '',
      baths: '',
      maxPrice: ''
    });
  });

  test('does not crash when onSearch is not provided', () => {
    render(<PropertyFilters />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(
      screen.getByRole('button', { name: /search/i })
    ).toBeInTheDocument();
  });
});