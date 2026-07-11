const express = require('express'); // import Express
const router = express.Router(); // create a router for property routes
const pool = require('../db/mysql'); // database connection

// route for getting all open houses for one property
router.get('/:id/openhouses', async (req, res) => {
  try {

    // get the listing ID from the URL
    const { id } = req.params;

    // make sure the property exists
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    // return an error if the property doesn't exist
    if (propertyCheck.length === 0) {
      return res.status(404).json({
        error: 'Property not found',
        message: `No property exists with ID: ${id}`
      });
    }

    // get all open houses for this property
    const [openhouses] = await pool.query(
      'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime',
      [id]
    );

    // return the open houses info
    res.json({
      propertyId: id,
      count: openhouses.length,
      openhouses
    });

  } catch (error) {
    //show if something went wrong 
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch open houses'
    });

  }
});

// route for getting the details for a single property by its listing ID
router.get('/:id', async (req, res) => {
  try {

    // get the listing ID from the URL
    const { id } = req.params;

    // make sure the property exists
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    // return an error if the property doesn't exist
    if (propertyCheck.length === 0) {
      return res.status(404).json({
        error: 'Property not found',
        message: `No property exists with ID: ${id}`
      });
    }

    // search for the property using its listing ID and get all information about it
    const [results] = await pool.query(
      'SELECT * FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    // return the property details
    res.json(results[0]);

  } catch (error) {
    //show if something went wrong 
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch property'
    });

  }
});

// route for getting all properties with filters
router.get('/', async (req, res) => {
  try {

    // pagination values (the default is the first 20 properties)
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // get all filters from the user
    const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;

    // make sure the user has entered valid values
    if (minPrice && isNaN(minPrice)) {
      return res.status(400).json({ error: 'minPrice must be a number' });
    }

    if (maxPrice && isNaN(maxPrice)) {
      return res.status(400).json({ error: 'maxPrice must be a number' });
    }

    if (beds && isNaN(beds)) {
      return res.status(400).json({ error: 'beds must be a number' });
    }

    if (baths && isNaN(baths)) {
      return res.status(400).json({ error: 'baths must be a number' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'limit must be between 1 and 100' });
    }

    if (offset < 0) {
      return res.status(400).json({ error: 'offset cannot be negative' });
    }

    // build the WHERE clause based on the filters provided by the user
    const conditions = [];
    const values = [];

    // only filter by city if it was provided
    if (city) {
      conditions.push("L_City = ?");
      values.push(city);
    }

    // only filter by zipcode if it was provided
    if (zipcode) {
      conditions.push("L_Zip = ?");
      values.push(zipcode);
    }

    // only include properties that cost at least minPrice
    if (minPrice) {
      conditions.push("L_SystemPrice >= ?");
      values.push(parseFloat(minPrice));
    }

    // only include properties that cost at most maxPrice
    if (maxPrice) {
      conditions.push("L_SystemPrice <= ?");
      values.push(parseFloat(maxPrice));
    }

    // only include properties with at least this many bedrooms
    if (beds) {
      conditions.push("L_Keyword2 >= ?");
      values.push(parseInt(beds));
    }

    // only include properties with at least this many bathrooms
    if (baths) {
      conditions.push("LM_Dec_3 >= ?");
      values.push(parseInt(baths));
    }

    // build the WHERE clause only when filters exist
    const whereClause =
      conditions.length > 0
        ? "WHERE " + conditions.join(" AND ")
        : "";

    // count how many properties match the filters
    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`,
      values
    );

    const total = countResult[0].total;

    // get the matching properties
    const [results] = await pool.query(
      `SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    // send everything back as JSON
    res.json({
      total,
      limit,
      offset,
      results
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch properties'
    });

  }
});

module.exports = router;