const pool = require('../config/database');

class Lead {
  static async createTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          roll_number VARCHAR(100) UNIQUE NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await pool.query(query);
      console.log('Leads table created or already exists');
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }

  static async getAllLeads() {
    try {
      const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error getting leads:', error);
      throw error;
    }
  }

  static async getLeadById(id) {
    try {
      const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting lead by ID:', error);
      throw error;
    }
  }

  static async createLead(leadData) {
    try {
      const { name, roll_number, phone_number, status = 'pending' } = leadData;
      const result = await pool.query(
        'INSERT INTO leads (name, roll_number, phone_number, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, roll_number, phone_number, status]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  static async updateLead(id, leadData) {
    try {
      const { name, roll_number, phone_number, status } = leadData;
      const result = await pool.query(
        'UPDATE leads SET name = $1, roll_number = $2, phone_number = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [name, roll_number, phone_number, status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  static async deleteLead(id) {
    try {
      const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  static async updateLeadStatus(id, status) {
    try {
      const result = await pool.query(
        'UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }
}

module.exports = Lead;