const router = require("express").Router();
const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getAllProjects,
  getProjectsById,
  updateProject,
  deleteProject,
} = require("../controller/ProjectController");
router
  .route("/createProject")
  .post(authentication, restrictTo("1"), createProject);
router
  .route("/getProject")
  .get(authentication, restrictTo("1"), getAllProjects);
router
  .route("/getProjectByid/:id")
  .get(authentication, restrictTo("1"), getProjectsById)
  .patch(authentication, restrictTo("1"), updateProject)
  .delete(authentication, restrictTo("1"), deleteProject);
module.exports = router;
