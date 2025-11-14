const express = require('express');
const cors = require('cors');
require('dotenv').config();

const leadRoutes = require('./routes/leads');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database table
Lead.createTable();

// Routes
app.use('/api/leads', leadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CRM Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});