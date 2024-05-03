const express = require("express");
const router = express.Router();

const home = require("../controllers/homeController");
const check = require("../middlewares/apiMiddleware");

router.get(["/home", "/"], home.get_home);
router.get("/home1", home.get_home1);
router.get("/cn", home.get_cn);
router.get("/demoApi", home.getDemoApi);

module.exports = router;
