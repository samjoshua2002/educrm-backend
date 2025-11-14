const { Client } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
  const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'educrm'"
    );

    if (dbCheck.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query('CREATE DATABASE educrm');
      console.log('Database "educrm" created successfully');
    } else {
      console.log('Database "educrm" already exists');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
  }
}

initializeDatabase();