const dotenv = require('dotenv');
const mongoose = require('mongoose');
const please = require('./scripts/dataParserDaily');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER EXEPTION!    SHUTING DOWN...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

if (!process.env.PORT) {
  dotenv.config({ path: './config.env' });
}

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });

please();

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION!    SHUTING DOWN...');
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

//
