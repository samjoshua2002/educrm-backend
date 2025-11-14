const Lead = require('../models/Lead');

const leadController = {
  // Get all leads
  async getAllLeads(req, res) {
    try {
      const leads = await Lead.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get lead by ID
  async getLeadById(req, res) {
    try {
      const lead = await Lead.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new lead
  async createLead(req, res) {
    try {
      const { name, roll_number, phone_number, status } = req.body;
      
      if (!name || !roll_number || !phone_number) {
        return res.status(400).json({ error: 'Name, roll number, and phone number are required' });
      }

      const lead = await Lead.createLead({ name, roll_number, phone_number, status });
      res.status(201).json(lead);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        res.status(400).json({ error: 'Roll number already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update lead
  async updateLead(req, res) {
    try {
      const { name, roll_number, phone_number, status } = req.body;
      const lead = await Lead.updateLead(req.params.id, { name, roll_number, phone_number, status });
      
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      res.json(lead);
    } catch (error) {
      if (error.code === '23505') {
        res.status(400).json({ error: 'Roll number already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete lead
  async deleteLead(req, res) {
    try {
      const lead = await Lead.deleteLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update lead status
  async updateLeadStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'contacted', 'qualified', 'converted', 'rejected'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const lead = await Lead.updateLeadStatus(req.params.id, status);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = leadController;