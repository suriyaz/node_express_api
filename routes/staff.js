const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const passportJWT = require('../middleware/passportJWT');

/* GET all */
/* localhost:3000/staff */
router.get('/', [ passportJWT.isLogin ], staffController.index);

/* GET By id */
/* localhost:3000/staff/5eaa9aab6682f130c89793c5 */
router.get('/:id', staffController.show);

/* localhost:3000/staff */
router.post('/', staffController.create);

/* localhost:3000/staff/5eaa9aab6682f130c89793c5 */
router.put('/:id', staffController.edit);

/* localhost:3000/staff/5eaa9aab6682f130c89793c5 */
router.delete('/:id', staffController.del);

module.exports = router;
