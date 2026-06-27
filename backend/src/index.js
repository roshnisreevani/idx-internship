const express = require('express');
const cors = require('cors');
const pool = require('./db/mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});