const request = require('supertest');
const app = require('../index');
const pool = require('../db/mysql');

describe('GET /api/properties', () => {
  test('returns properties successfully', async () => {
    const response = await request(app)
      .get('/api/properties')
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
  });

  test('returns an error for an invalid limit', async () => {
    const response = await request(app)
      .get('/api/properties?limit=abc')
      .expect(400);

    expect(response.body.error).toBe('limit must be a number');
  });

  test('filters properties by city', async () => {
    const response = await request(app)
      .get('/api/properties?city=Beverly%20Hills')
      .expect(200);

    expect(response.body).toHaveProperty('results');
  });

  test('filters properties by minimum price', async () => {
    const response = await request(app)
      .get('/api/properties?minPrice=300000')
      .expect(200);

    expect(response.body).toHaveProperty('results');
  });
});

describe('GET /api/properties/:id', () => {
  test('returns a property when the ID exists', async () => {
    const response = await request(app)
      .get('/api/properties/1118422731')
      .expect(200);

    expect(response.body).toHaveProperty(
      'L_ListingID',
      '1118422731'
    );
  });

  test('returns 404 for a property that does not exist', async () => {
    const response = await request(app)
      .get('/api/properties/does-not-exist')
      .expect(404);

    expect(response.body.error).toBe('Property not found');
  });
});

describe('GET /api/properties/:id/openhouses', () => {
  test('returns 404 for open houses of a property that does not exist', async () => {
    const response = await request(app)
      .get('/api/properties/does-not-exist/openhouses')
      .expect(404);

    expect(response.body.error).toBe('Property not found');
  });
});

afterAll(async () => {
  await pool.end();
});

describe('GET /api/properties validation', () => {
  test('returns an error for an invalid offset', async () => {
    const response = await request(app)
      .get('/api/properties?offset=abc')
      .expect(400);

    expect(response.body.error).toBe(
      'offset must be a number'
    );
  });

  test('returns an error for a negative offset', async () => {
    const response = await request(app)
      .get('/api/properties?offset=-1')
      .expect(400);

    expect(response.body.error).toBe(
      'offset cannot be negative'
    );
  });

  test('returns an error for an invalid minimum price', async () => {
    const response = await request(app)
      .get('/api/properties?minPrice=abc')
      .expect(400);

    expect(response.body.error).toBe(
      'minPrice must be a number'
    );
  });

  test('returns an error for an invalid maximum price', async () => {
    const response = await request(app)
      .get('/api/properties?maxPrice=abc')
      .expect(400);

    expect(response.body.error).toBe(
      'maxPrice must be a number'
    );
  });

  test('returns an error for an invalid number of beds', async () => {
    const response = await request(app)
      .get('/api/properties?beds=abc')
      .expect(400);

    expect(response.body.error).toBe(
      'beds must be a number'
    );
  });

  test('returns an error for an invalid number of baths', async () => {
    const response = await request(app)
      .get('/api/properties?baths=abc')
      .expect(400);

    expect(response.body.error).toBe(
      'baths must be a number'
    );
  });

  test('returns an error for an invalid sort field', async () => {
    const response = await request(app)
      .get('/api/properties?sortBy=invalidField')
      .expect(400);

    expect(response.body.error).toBe(
      'Invalid sort field'
    );
  });

  test('returns an error for an invalid sort order', async () => {
    const response = await request(app)
      .get(
        '/api/properties?sortBy=L_SystemPrice&sortOrder=INVALID'
      )
      .expect(400);

    expect(response.body.error).toBe(
      'Invalid sort order'
    );
  });
});

describe('GET /api/properties sorting', () => {
  test('returns properties sorted by price', async () => {
    const response = await request(app)
      .get(
        '/api/properties?sortBy=L_SystemPrice&sortOrder=ASC'
      )
      .expect(200);

    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
  });

  test('uses ascending order when sort order is not provided', async () => {
    const response = await request(app)
      .get('/api/properties?sortBy=L_SystemPrice')
      .expect(200);

    expect(response.body).toHaveProperty('results');
  });
});

describe('GET /api/properties/:id/openhouses success cases', () => {
  test('returns open houses for an existing property', async () => {
    const response = await request(app)
      .get('/api/properties/1118422731/openhouses')
      .expect(200);

    expect(response.body).toHaveProperty('propertyId');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('openhouses');

    expect(
      Array.isArray(response.body.openhouses)
    ).toBe(true);
  });
});