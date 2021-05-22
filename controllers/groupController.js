const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const mongoose = require('mongoose');

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
  if (!group) {
    return next(new AppError('there is not such group!', 401));
  }
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
  if (!group.users.includes(user._id)) {
    return next(
      new AppError(
        'You must be a member of this group this group! Access denied!',
        403
      )
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

  if (group.users.includes(user._id)) {
    return next(
      new AppError('You are already in this group! Access denied!', 403)
    );
  }
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
  if (!group.users.includes(user._id)) {
    return next(
      new AppError('You are not a part of this group! Access denied!', 403)
    );
  }
  const thisUserGroupBetsIndex = group.data.userGroupBets.findIndex((userG) => {
    console.log(userG);
    console.log(user);
    return userG.user.toString() == user._id.toString();
  });

  if (thisUserGroupBetsIndex != -1) {
    const betIndex = group.data.userGroupBets[
      thisUserGroupBetsIndex
    ].userBets.findIndex((el) => el.gameId == userBet.gameId);
    if (betIndex != -1) {
      group.data.userGroupBets[thisUserGroupBetsIndex].userBets[
        betIndex
      ] = userBet;
    } else {
      group.data.userGroupBets[thisUserGroupBetsIndex].userBets.push(userBet);
    }
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

exports.deleteBet = catchAsync(async (req, res, next) => {
  const { user } = req;

  const group = await Group.findById(req.params.id);

  if (!group.users.includes(user._id)) {
    return next(
      new AppError('You are not a part of this group! Access denied!', 403)
    );
  }

  const thisUserGroupBetsIndex = group.data.userGroupBets.findIndex((userG) => {
    return userG.user.toString() == user._id.toString();
  });

  if (thisUserGroupBetsIndex == -1) {
    return next(new AppError('You do not have bets in this group!', 403));
  }

  const betIndex = group.data.userGroupBets[
    thisUserGroupBetsIndex
  ].userBets.findIndex((el) => el.gameId == req.body.gameId);
  if (betIndex == -1) {
    return next(
      new AppError('You do not bet on this game in this group!', 403)
    );
  }

  group.data.userGroupBets[thisUserGroupBetsIndex].userBets.splice(betIndex, 1);

  await Group.findByIdAndUpdate(group._id, group);

  res.status(200).json({
    status: 'success',
  });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  const { user } = req;
  const group = await Group.findById(req.params.id);

  if (!group.adminUser.equals(user._id)) {
    return next(
      new AppError('You are not the admin of this group! Access denied!', 403)
    );
  }

  const groupId = group._id;

  const users = await User.find({ _id: { $in: group.users } });

  console.log('users:', users);

  for (let i = 0; i < users.length; i++) {
    console.log(users[i]);
    users[i].groups.splice(
      users[i].groups.findIndex((el) => el.toString() == groupId.toString()),
      1
    );
    await User.findByIdAndUpdate(users[i]._id, users[i]);
  }

  await Group.findByIdAndDelete(groupId);

  res.status(200).json({
    status: 'success',
  });
});

exports.newTeamChoice = catchAsync(async (req, res, next) => {
  const { user } = req;

  const group = await Group.findById(req.params.id);
  if (!group.users.includes(user._id)) {
    return next(
      new AppError('You are not a part of this group! Access denied!', 403)
    );
  }

  if (!req.body.teamChoice) {
    return next(new AppError('no team choice!', 403));
  }
  const thisUserGroupBetsIndex = group.data.userGroupBets.findIndex((userG) => {
    return userG.user.toString() == user._id.toString();
  });

  if (group.data.userGroupBets[thisUserGroupBetsIndex].teamChoice){
    return next(new AppError('team already chosen!', 403));
  }
  group.data.userGroupBets[thisUserGroupBetsIndex].teamChoice =
    req.body.teamChoice;

  await Group.findByIdAndUpdate(group._id, group);

  res.status(200).json({
    status: 'success',
  });
});
