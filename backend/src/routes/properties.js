const express = require('express');
const router = express.Router();
const pool = require('../db/mysql');

// Get all open houses for a property
router.get('/:id/openhouses', async (req, res) => {
  try {
    const { id } = req.params;

    // Check that the property exists first
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    if (propertyCheck.length === 0) {
      return res.status(404).json({
        error: 'Property not found',
        message: `No property exists with ID: ${id}`
      });
    }

    // Get the open houses for this property
    const [openhouses] = await pool.query(
      'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime',
      [id]
    );

    res.json({
      propertyId: id,
      count: openhouses.length,
      openhouses
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch open houses'
    });
  }
});

// Get details for one property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check that the property exists
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    if (propertyCheck.length === 0) {
      return res.status(404).json({
        error: 'Property not found',
        message: `No property exists with ID: ${id}`
      });
    }

    const [results] = await pool.query(
      'SELECT * FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    res.json(results[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch property'
    });
  }
});

// Get properties with filters, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      sortBy,
      sortOrder
    } = req.query;

    // Make sure numeric values are actually numbers
    if (req.query.limit && isNaN(req.query.limit)) {
      return res.status(400).json({
        error: 'limit must be a number'
      });
    }

    if (req.query.offset && isNaN(req.query.offset)) {
      return res.status(400).json({
        error: 'offset must be a number'
      });
    }

    // pagination values (the default is the first 20 properties)
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Week 9: sorting to the property fields for the backend 
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      sortBy,
      sortOrder
    } = req.query;

    // make sure the user has entered valid values & rejects if invalid 
    //Performance Validation for week 9 as well 
    if (minPrice && isNaN(minPrice)) {
      return res.status(400).json({
        error: 'minPrice must be a number'
      });
    }

    if (maxPrice && isNaN(maxPrice)) {
      return res.status(400).json({
        error: 'maxPrice must be a number'
      });
    }

    if (beds && isNaN(beds)) {
      return res.status(400).json({
        error: 'beds must be a number'
      });
    }

    if (baths && isNaN(baths)) {
      return res.status(400).json({
        error: 'baths must be a number'
      });
    }

    // Default to 20 properties starting at the beginning
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'limit must be between 1 and 100'
      });
    }

    if (offset < 0) {
      return res.status(400).json({
        error: 'offset cannot be negative'
      });
    }

    // Week 9: array of valid sorting fields. if request is not in this field it will return an error
    const validSortFields = [
      'L_SystemPrice', //price
      'ListingContractDate', //listing date
      'LM_Int2_3', //sq footage 
      'L_Keyword2' //beds
    ];

    const validSortOrders = ['ASC', 'DESC']; //Week 9: Only restricted to ascending or descending order

    if (sortBy && !validSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: 'Invalid sort field'
      });
    }

    if (
      sortOrder &&
      !validSortOrders.includes(sortOrder.toUpperCase())
    ) {
      return res.status(400).json({
        error: 'Invalid sort order'
      });
    }

    // Build the filters based on what the user searched for
    const conditions = [];
    const values = [];

    if (city) {
      conditions.push('L_City = ?');
      values.push(city);
    }

    if (zipcode) {
      conditions.push('L_Zip = ?');
      values.push(zipcode);
    }

    if (minPrice) {
      conditions.push('L_SystemPrice >= ?');
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push('L_SystemPrice <= ?');
      values.push(parseFloat(maxPrice));
    }

    if (beds) {
      conditions.push('L_Keyword2 >= ?');
      values.push(parseInt(beds));
    }

    if (baths) {
      conditions.push('LM_Dec_3 >= ?');
      values.push(parseInt(baths));
    }

    // Only add WHERE when there are filters
    const whereClause =
      conditions.length > 0
        ? 'WHERE ' + conditions.join(' AND ')
        : '';

    // Get the total number of matching properties
    const [countResult] = await pool.query(
      'SELECT COUNT(*) AS total FROM rets_property ' + whereClause,
      values
    );

    const total = countResult[0].total;

    // Add sorting if the user selected a sort field
    let orderClause = '';

    if (sortBy) {
      const order = sortOrder
        ? sortOrder.toUpperCase()
        : 'ASC';

      orderClause = `ORDER BY ${sortBy} ${order}`;
    }

    // Get the properties for the current page
    const [results] = await pool.query(
      `SELECT * FROM rets_property ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

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