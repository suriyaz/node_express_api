const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
/* localhost:3000/user/ */
router.get('/', userController.index);

/* localhost:3000/user/login */
router.post('/login', userController.login);

/* localhost:3000/user/register */
router.post('/register', [
    body('name').not().isEmpty().withMessage('กรุณาป้อนชื่อสกุลด้วย'),
    body('email').not().isEmpty().withMessage('กรุณากรอกอีเมลล์ด้วย').isEmail().withMessage('รูปแบบอีเมลล์ไม่ถูกต้อง'),
    body('password').not().isEmpty().withMessage('กรุณากรอกรหัสผ่านด้วย').isLength({min: 3}).withMessage('รหัสผ่านต้อง 4 ตัวอักษรขึ้นไป')
], userController.register);

/* localhost:3000/user/me */
router.get('/me', [ passportJWT.isLogin ], userController.me);

module.exports = router;
