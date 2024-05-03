const express = require("express");
const router = express.Router();

const group = require("../controllers/groupController");

router.get("/groupForm", group.get_group_form);
router.post("/groupForm", group.post_group_form);
router.get("/groups", group.get_groups);
router.post("/checkGroup", group.get_group);

module.exports = router;
