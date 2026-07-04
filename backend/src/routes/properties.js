const express = require('express'); // import Express
const router = express.Router(); // create a router for property routes
const pool = require('../db/mysql'); // database connection

router.get('/', async (req, res) => {
  try {
    // pagination values (the default is the first 20 properties)
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // get query values from the parameters 
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

    //build the WHERE clause based on the filters provided by the user
    const conditions = [];
    const values = [];

    // only filter by city if it was provided
    if (req.query.city) {
      conditions.push("L_City = ?");
      values.push(req.query.city);
    }

    // only filter by zipcode if it was provided
    if (req.query.zipcode) {
      conditions.push("L_Zip = ?");
      values.push(req.query.zipcode);
    }

    // only include properties that cost at least minPrice
    if (req.query.minPrice) {
      conditions.push("L_SystemPrice >= ?");
      values.push(parseFloat(req.query.minPrice));
    }

    // only include properties that cost at most maxPrice
    if (req.query.maxPrice) {
      conditions.push("L_SystemPrice <= ?");
      values.push(parseFloat(req.query.maxPrice));
    }

    // only include properties with at least this many bedrooms
    if (req.query.beds) {
      conditions.push("L_Keyword2 >= ?");
      values.push(parseInt(req.query.beds));
    }

    // only include properties with at least this many bathrooms
    if (req.query.baths) {
      conditions.push("LM_Dec_3 >= ?");
      values.push(parseInt(req.query.baths));
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

    // get the properties for the current page
    const [results] = await pool.query(
      `SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    // send everything back as JSON output to user
    res.json({
      total,
      limit,
      offset,
      results
    });

  } catch (error) {
    // basically shows when "something went wrong"
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch properties'
    });
  }
});

module.exports = router; // export the router so index.js can also use it