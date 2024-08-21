const router = require("express").Router();
const { createProject } = require("../controller/ProjectController");
router.route("/createProject").post(createProject);
module.exports = router;
