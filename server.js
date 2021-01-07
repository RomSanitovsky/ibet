const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('UNHANDLER EXEPTION!    SHUTING DOWN...');
    console.log(err.name , err.message);
    process.exit(1);

})

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB ,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
        useFindAndModify: false
    }).then(()=>{console.log("DB connection successful!");
    }).catch(err => {
        console.log(err.name , err.message);
    });