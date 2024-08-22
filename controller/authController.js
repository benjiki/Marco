const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user type", 400);
  }
  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    ConfirmPassword: body.ConfirmPassword,
  });
  if (!newUser) {
    return next(new AppError("Failed to create user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.ConfirmPassword;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });
  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Provide Both Email and Password"));
  }
  const result = await user.findOne({ where: { email } });
  if (!result || !bcrypt.compare(password, result.password)) {
    return next(new AppError("Invalid email or password", 401));
  }
  const token = generateToken({ id: result.id });
  return res.status(200).json({ status: "success", token });
});

const authentication = catchAsync(async (req, res, next) => {
  // 1. Get the token from headers
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(
      new AppError("You do not have permission to access this route", 401)
    );
  }

  // 2. Verify the token
  let tokenDetail;
  try {
    tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new AppError("Invalid token. Please log in again!", 401));
  }

  // 3. Check if the token has not expired
  if (tokenDetail.exp * 1000 < Date.now()) {
    return next(new AppError("Your token has expired", 401));
  }

  // 4. Get the user details from the DB and add to req object
  const freshUser = await user.findByPk(tokenDetail.id);
  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }

  req.user = freshUser;
  return next();
});
const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };
