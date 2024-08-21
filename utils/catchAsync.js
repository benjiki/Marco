// utils/catchAsync.js

const catchAsync = (fn) => {
  const errorHandler = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return errorHandler; // Do not invoke the function here
};

module.exports = catchAsync;
