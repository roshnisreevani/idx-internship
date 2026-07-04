const express = require('express');
const cors = require('cors');
const pool = require('./db/mysql');
const propertiesRouter = require('./routes/properties'); //imports all property based routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
//sends all requests to /api/properties to the propertiesRouter
app.use('/api/properties', propertiesRouter);

//checks if it can actually conect to the database
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS test');

    res.json({
      status: 'ok',
      database: 'connected',
      test: rows
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(500).json({
      status: 'error',
      message: error.message || 'Database connection failed',
      code: error.code || 'UNKNOWN'
    });
  }
});

//starts server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});