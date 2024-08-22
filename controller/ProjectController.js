const project = require("../db/models/project");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;
  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    ProductUrl: body.ProductUrl,
    category: body.category,
    tag: body.tag,
    createdBy: userId,
  });
  res
    .status(201)
    .json({ message: "Project created successfully", data: newProject });
});
const getAllProjects = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const result = await project.findAll({
    include: user,
    where: { createdBy: userId },
  });
  if (!result) {
    return next(new AppError("There are no Projects ", 400));
  }
  res
    .status(200)
    .json({ message: "Projects fetched successfully", data: result });
});

const getProjectsById = catchAsync(async (req, res, next) => {
  const ProjectId = req.params.id;
  const result = await project.findByPk(ProjectId, { include: user });
  if (!result) {
    return next(new AppError("Invalid Project ID", 400));
  }
  res
    .status(200)
    .json({ message: "Projects fetched successfully", data: result });
});
const updateProject = catchAsync(async (req, res, next) => {
  const ProjectId = req.params.id;
  const body = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware that sets req.user

  // 1. Find the project by ID and ensure it was created by the authenticated user
  const result = await project.findOne({
    where: { id: ProjectId, createdBy: userId },
  });

  if (!result) {
    return next(new AppError("Invalid Project ID", 400));
  }

  // 2. Update the project with new values
  result.title = body.title || result.title;
  result.productImage = body.productImage || result.productImage;
  result.price = body.price || result.price;
  result.shortDescription = body.shortDescription || result.shortDescription;
  result.description = body.description || result.description;
  result.ProductUrl = body.ProductUrl || result.ProductUrl;
  result.category = body.category || result.category;
  result.tag = body.tag || result.tag;

  // 3. Save the updated project
  const updatedResult = await result.save();

  // 4. Return the updated project
  return res.json({
    status: "success",
    data: updatedResult,
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const ProjectId = req.params.id;
  const body = req.body;
  const userId = req.user.id;
  const result = await project.findOne({
    where: { id: ProjectId, createdBy: userId },
  });

  if (!result) {
    return next(new AppError("Invalid Project ID", 400));
  }

  await result.destroy();

  return res.json({
    status: "success",
    message: "Record Deleted successfully !",
  });
});
module.exports = {
  createProject,
  getAllProjects,
  getProjectsById,
  updateProject,
  deleteProject,
};
