const project = require("../db/models/project");
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
  const result = await project.findAll();
  res
    .status(200)
    .json({ message: "Projects fetched successfully", data: result });
});

module.exports = { createProject, getAllProjects };
