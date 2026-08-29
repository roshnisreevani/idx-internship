import {
  fetchProperties,
  fetchPropertyDetail,
  fetchOpenHouses
} from './client';

beforeEach(() => {
  global.fetch = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('API client', () => {
  test('fetchProperties returns property data', async () => {
    const mockProperties = [
      {
        L_ListingID: '123',
        L_Address: '123 Main Street'
      }
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockProperties)
    });

    const result = await fetchProperties();

    expect(fetch).toHaveBeenCalledWith('/api/properties');
    expect(result).toEqual(mockProperties);
  });

  test('fetchProperties sends query parameters', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([])
    });

    await fetchProperties({
      city: 'Chicago',
      minPrice: 200000
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/properties?city=Chicago&minPrice=200000'
    );
  });

  test('fetchProperties throws an error when the request fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(
      fetchProperties()
    ).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    );

    expect(console.error).toHaveBeenCalled();
  });

  test('fetchProperties handles network errors', async () => {
    global.fetch.mockRejectedValue(
      new Error('Network Error')
    );

    await expect(
      fetchProperties()
    ).rejects.toThrow('Network Error');

    expect(console.error).toHaveBeenCalled();
  });

  test('fetchPropertyDetail returns property data', async () => {
    const mockProperty = {
      L_ListingID: '12345',
      L_Address: '123 Main Street'
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockProperty)
    });

    const result = await fetchPropertyDetail('12345');

    expect(fetch).toHaveBeenCalledWith(
      '/api/properties/12345'
    );

    expect(result).toEqual(mockProperty);
  });

  test('fetchPropertyDetail throws Property not found for 404', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(
      fetchPropertyDetail('99999')
    ).rejects.toThrow('Property not found');

    expect(console.error).toHaveBeenCalled();
  });

  test('fetchPropertyDetail throws an HTTP error for other failures', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(
      fetchPropertyDetail('12345')
    ).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    );
  });

  test('fetchPropertyDetail handles network errors', async () => {
    global.fetch.mockRejectedValue(
      new Error('Network Error')
    );

    await expect(
      fetchPropertyDetail('12345')
    ).rejects.toThrow('Network Error');

    expect(console.error).toHaveBeenCalled();
  });

  test('fetchOpenHouses returns open house data', async () => {
    const mockOpenHouses = [
      {
        date: 'Saturday',
        startTime: '12:00 PM',
        endTime: '2:00 PM'
      }
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockOpenHouses)
    });

    const result = await fetchOpenHouses('12345');

    expect(fetch).toHaveBeenCalledWith(
      '/api/properties/12345/openhouses'
    );

    expect(result).toEqual(mockOpenHouses);
  });

  test('fetchOpenHouses throws an error when the request fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(
      fetchOpenHouses('12345')
    ).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    );

    expect(console.error).toHaveBeenCalled();
  });

  test('fetchOpenHouses handles network errors', async () => {
    global.fetch.mockRejectedValue(
      new Error('Network Error')
    );

    await expect(
      fetchOpenHouses('12345')
    ).rejects.toThrow('Network Error');

    expect(console.error).toHaveBeenCalled();
  });
});