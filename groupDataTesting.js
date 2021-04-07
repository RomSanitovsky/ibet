const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Group = require('./models/groupModel');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const createTest = async () => {
  const myGroup = {};
  myGroup.groupName = 'Test Group';
  myGroup.adminUser = '60684d08457cdd002f5d1e45';
  myGroup.users = ['60684d08457cdd002f5d1e45'];
  myGroup.pointsFormat = {
    FinalMatchWinner: 1,
    Total: 10,
  };
  myGroup.data = {
    userGroupBets: [
      {
        user: '60684d08457cdd002f5d1e45',
        userBets: [
          {
            gameId: '7960',
            finalMatchWinner: 1,
            totalPoints: 204,
          },
          {
            gameId: '7961',
            finalMatchWinner: 1,
            totalPoints: 200,
          },
        ],
      },
    ],
  };

  const group = await Group.create(myGroup);
  group.calcPoints();
  await Group.findByIdAndUpdate(group.id, group);
  mongoose.disconnect();
};

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
    createTest();
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });
