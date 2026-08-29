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