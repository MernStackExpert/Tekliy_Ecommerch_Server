const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');

router.get('/', getCategories);         
router.post('/', addCategory);        
router.patch('/:id', updateCategory); 
router.delete('/:id', deleteCategory); 

module.exports = router;