const { promisify } = require('util');
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const User = require(`${__dirname}/../models/usersModel`);
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const generateJwtToken = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const signup = catchAsync(async function (req, resp, next) {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  const token = generateJwtToken(newUser._id);

  resp.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async function (req, resp, next) {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError('Please provide an username or password!', 400));

  const user = await User.findOne({ username });

  if (user && user.failedExpiryTime > Date.now()) {
    resp.status(401).json({
      status: 'fail',
      message: 'Try logging in after 2 minutes!',
    });
  }

  if (!user) {
    return next(new AppError('Incorrect username or password', 401));
  }
  if (user && !(await user.correctPassword(password))) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts > 3) {
      user.failedLoginAttempts = 0;
      user.failedExpiryTime = Date.now() + 2 * 60 * 1000;

      resp.status(401).json({
        status: 'fail',
        message: 'Login attempts exceeded! Try again later.',
      });
    }

    await user.save();

    return next(new AppError('Incorrect password', 401));
  }

  user.failedLoginAttempts = 0;
  user.failedExpiryTime = null;
  await user.save();

  const token = generateJwtToken(user._id);
  resp.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync(async function (req, resp, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  req.user = currentUser;

  next();
});

module.exports = { signup, login, protect };
