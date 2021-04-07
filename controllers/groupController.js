const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Group = require('../models/groupModel');

exports.createGroup = catchAsync(async (req, res, next) => {
  const { body, user } = req;
  body.adminUser = user._id;
  body.users = [user._id];
  body.data = {
    userGroupBets: [
      {
        user: user._id,
      },
    ],
  };

  group = await Group.create(body);

  res.status(200).json({
    status: 'success',
    group,
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const { user } = req;
  const group = await Group.findById(req.params.id);
  if (!group.users.includes(user._id)) {
    return next(
      new AppError('You are not a part of this group! Access denied!', 403)
    );
  }
  res.status(200).json({
    status: 'success',
    group,
  });
});
