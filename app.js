require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./router/authRouter");
const projectRouter = require("./router/projectRouter");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const app = express();

app.use(express.json());

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
// 404 handler
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`cant find ${req.originalUrl}on this server`, 404);
  })
);
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 3000; // Provide a default value for the port
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
