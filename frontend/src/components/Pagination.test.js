import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {

  test('renders pagination controls', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 5/i)).toBeInTheDocument();
  });

  test('Previous button is disabled on first page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText(/Previous/i)).toBeDisabled();
  });

  test('Next button is disabled on last page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText(/Next/i)).toBeDisabled();
  });

  test('clicking Next changes the page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText(/Next/i));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('clicking Previous changes the page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText(/Previous/i));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('does not render when only one page exists', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

});