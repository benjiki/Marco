const router = require("express").Router();
const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getAllProjects,
} = require("../controller/ProjectController");
router
  .route("/createProject")
  .post(authentication, restrictTo("1"), createProject);
router.route("/getProject").get(authentication, getAllProjects);
module.exports = router;
