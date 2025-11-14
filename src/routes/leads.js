const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// GET /api/leads - Get all leads
router.get('/', leadController.getAllLeads);

// GET /api/leads/:id - Get lead by ID
router.get('/:id', leadController.getLeadById);

// POST /api/leads - Create new lead
router.post('/', leadController.createLead);

// PUT /api/leads/:id - Update lead
router.put('/:id', leadController.updateLead);

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', leadController.deleteLead);

// PATCH /api/leads/:id/status - Update lead status
router.patch('/:id/status', leadController.updateLeadStatus);

module.exports = router;