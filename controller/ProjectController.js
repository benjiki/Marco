const project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    ProductUrl: body.ProductUrl,
    category: body.category,
    tag: body.tag,
    createdBy: 1,
  });
  res
    .status(201)
    .json({ message: "Project created successfully", data: newProject });
});

module.exports = { createProject };
