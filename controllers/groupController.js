const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

const Group = require('../models/groupModel');
const User = require('../models/userModel');
const { getPriority } = require('os');

exports.createGroup = catchAsync(async (req, res, next) => {
  const { body, user } = req;
  body.adminUser = user._id;
  body.users = [user._id];
  body.data = {
    userGroupBets: [
      {
        user: user._id,
        userName: user.userName,
      },
    ],
  };
  body.groupToken = crypto.randomBytes(8).toString('hex');

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
  group.calcPoints();
  res.status(200).json({
    status: 'success',
    group,
  });
});

exports.shareGroup = catchAsync(async (req, res, next) => {
  const { user } = req;
  const group = await Group.findById(req.params.id).select('+groupToken');
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

exports.joinGroup = catchAsync(async (req, res, next) => {
  const { user } = req;

  console.log(req.body);
  const group = await Group.findOne({ groupToken: req.body.groupToken });
  console.log(group);
  user.groups.push(group._id);
  group.users.push(user._id);
  group.data.userGroupBets.push({ user: user._id, userName: user.userName });

  await User.findByIdAndUpdate(user._id, user);
  await Group.findByIdAndUpdate(group._id, group);

  res.status(200).json({
    status: 'success',
  });
});

exports.addNewBet = catchAsync(async (req, res, next) => {
  const { user } = req;
  const userBet = {};
  userBet.finalMatchWinner = req.body.finalMatchWinner;
  userBet.totalPoints = req.body.totalPoints;
  userBet.gameId = req.body.gameId;

  const group = await Group.findById(req.params.id);
  const thisUserGroupBetsIndex = group.data.userGroupBets.findIndex((userG) => {
    console.log(userG);
    console.log(user);
    return userG.user.toString() == user._id.toString();
  });

  console.log(thisUserGroupBetsIndex);

  if (thisUserGroupBetsIndex != -1) {
    console.log(group.data.userGroupBets[thisUserGroupBetsIndex]);
    group.data.userGroupBets[thisUserGroupBetsIndex].userBets.push(userBet);
  } else {
    group.data.userGroupBets.push({ user: user._id, userBets: [userBet] });
  }

  await Group.findByIdAndUpdate(group._id, group);

  res.status(200).json({
    status: 'success',
  });
});

exports.setLogo = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { logo } = req.body;

  const group = await Group.findById(req.params.id);

  if (!group.adminUser.equals(user._id)) {
    return next(
      new AppError('You are not the admin of this group! Access denied!', 403)
    );
  }
  group.logo = logo;
  await Group.findByIdAndUpdate(group._id, group);

  res.status(200).json({
    status: 'success',
  });
});
