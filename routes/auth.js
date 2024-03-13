const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/auth/register', authController.register);

router.post('/login', authController.login);
router.post('/auth/login', authController.login);

router.get('/logout', authController.logout);
 
router.get('/data', authController.data);

router.post('/find', authController.find);

//  REGISTERING CASE INSIDE CRIME.hbs
router.get('/register_case', authController.form);
router.post('/register_case', authController.register_case);

router.get('/information_page', authController.information);

router.get("/admin_panel",authController.view);
router.get("/auth/admin_panel",authController.view);

router.get("/view", authController.view);
// router.get("/view/:fir_id", authController.edit);

router.get("/success");

router.get("/edit_user/:fir_id", authController.edit);
router.post("/edit_user/:fir_id", authController.update);

router.post("/:fir_id", authController.delete);

module.exports = router;