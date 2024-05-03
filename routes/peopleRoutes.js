const express = require("express");
const router = express.Router();

const peoples = require("../controllers/peopleController");
// const { authenticatedUser } = require("../middlewares/auth");

router.get("/peopleForm", peoples.get_people_form);
router.post("/peopleForm", peoples.post_people_form);
router.post("/find_users", peoples.find_users);
router.get("/get_users", peoples.get_users);
router.post("/check-name", peoples.get_names);
router.post("/update_eligibil", peoples.update_eligibil);
router.post("/update_marital", peoples.update_marital);
router.get("/user_details", peoples.user_details);
router.get("/download", peoples.download);
router.get("/admin_dashboard", peoples.admin_dashboard);

module.exports = router;
