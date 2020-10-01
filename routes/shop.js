const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

/* localhost:3000/shop */
router.get('/', shopController.index);

/* localhost:3000/shop/menu */
router.get('/menu', shopController.menu);

/* localhost:3000/shop/:id */
router.get('/:id', shopController.getShopWithMenu);

/* localhost:3000/shop/ */
router.post('/', shopController.createShop);

module.exports = router;
