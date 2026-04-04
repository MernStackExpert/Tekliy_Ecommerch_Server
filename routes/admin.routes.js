const express = require('express');
const router = express.Router();
const { 
  createAdminUser, 
  adminLogin, 
  updateAdminStatus 
} = require('../controllers/admin.controller');

router.post('/register', createAdminUser);
router.post('/login', adminLogin);
router.patch('/update-status/:id', updateAdminStatus);

module.exports = router;