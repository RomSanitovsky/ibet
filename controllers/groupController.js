const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Group = require('../models/groupModel');

exports.createGroup = catchAsync(async (req, res, next) => {
  const [body, user] = { req };
  body.adminUser = user._id;
  body.users = [user._id];

  group = await Group.create(body);

  res.status(200).json({
    status: 'success',
    group,
  });
});
