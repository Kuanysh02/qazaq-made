const express = require("express");
const profileController = require("../controllers/profileController");
const {requireAuth} = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', requireAuth, profileController.profile);
router.get('/orders', requireAuth, profileController.getOrders);
router.get('/edit',requireAuth, profileController.getEditProfile);
router.patch('/edit', requireAuth, profileController.patchEditProfile);
router.delete('/edit', requireAuth, profileController.deleteEditProfile);

module.exports = router;