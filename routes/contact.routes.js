const express = require('express');
const router = express.Router();
const { 
  submitInquiry, 
  getAllInquiries, 
  updateInquiryStatus, 
  deleteInquiry 
} = require('../controllers/contact.controller');

router.post('/', submitInquiry);
router.get('/', getAllInquiries);
router.patch('/:id', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;