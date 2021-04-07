const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Group = require('../models/groupModel');

exports.createGroup = catchAsync(async (req, res, next) => {
  console.log(req);
  const { body, user } = { req };
  console.log(body);
  console.log(user);
  body.adminUser = user._id;
  body.users = [user._id];

  group = await Group.create(body);

  res.status(200).json({
    status: 'success',
    group,
  });
});
