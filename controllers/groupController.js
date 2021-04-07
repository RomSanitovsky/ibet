const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Group = require('../models/groupModel');
const User = require('../models/userModel');

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

  user.groups.push(group._id);
  await User.findByIdAndUpdate(user._id, user);
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

exports.shareGroup = catchAsync(async (req, res, next) => {
  const { user } = req;
  const group = await Group.findById(req.params.id);
  if (!group.adminUser.equals(user._id)) {
    return next(
      new AppError('You are not the admin of this group! Access denied!', 403)
    );
  }
  res.status(200).json({
    status: 'success',
    groupToken: group.groupToken,
  });
});
