const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  return res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  // Log error details (consider using a logger instead of console.log)
  console.error("ERROR 💥", error);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid Token", 401);
  }
  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
