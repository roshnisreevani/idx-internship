import { render, screen, fireEvent } from '@testing-library/react';
import PropertyImageCarousel from './PropertyImageCarousel';

describe('PropertyImageCarousel', () => {
  test('shows No Image when no photos are provided', () => {
    render(<PropertyImageCarousel photos={[]} />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  test('shows No Image when photos is not provided', () => {
    render(<PropertyImageCarousel />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  test('renders a single property image', () => {
    render(
      <PropertyImageCarousel
        photos={['https://example.com/property.jpg']}
        alt="Test Property"
      />
    );

    expect(screen.getByAltText('Test Property')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /next image/i })
    ).not.toBeInTheDocument();
  });

  test('uses the default alt text', () => {
    render(
      <PropertyImageCarousel
        photos={['https://example.com/property.jpg']}
      />
    );

    expect(screen.getByAltText('Property')).toBeInTheDocument();
  });

  test('moves to the next image', () => {
    render(
      <PropertyImageCarousel
        photos={[
          'https://example.com/first.jpg',
          'https://example.com/second.jpg'
        ]}
      />
    );

    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /next image/i })
    );

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByAltText('Property')).toHaveAttribute(
      'src',
      'https://example.com/second.jpg'
    );
  });

  test('moves to the previous image', () => {
    render(
      <PropertyImageCarousel
        photos={[
          'https://example.com/first.jpg',
          'https://example.com/second.jpg'
        ]}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /previous image/i })
    );

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  test('wraps from the last image back to the first image', () => {
    render(
      <PropertyImageCarousel
        photos={[
          'https://example.com/first.jpg',
          'https://example.com/second.jpg'
        ]}
      />
    );

    const nextButton = screen.getByRole('button', {
      name: /next image/i
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  test('wraps from the first image to the last image', () => {
    render(
      <PropertyImageCarousel
        photos={[
          'https://example.com/first.jpg',
          'https://example.com/second.jpg'
        ]}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /previous image/i })
    );

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});