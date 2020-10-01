const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const companyRouter = require('./routes/company');
const staffRouter = require('./routes/staff');
const shopRouter = require('./routes/shop');

// require config
const config = require('./config/index');

// import middleware
const errorHandler = require('./middleware/errorHandler');

    // อยากป้องกัน routes ไหน ถึงจะต้อง ล็อคอินเข้าก่อน ค่อยเข้าถึงได้
// const passportJWT = require('./middleware/passportJWT');

const app = express();

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors
app.use(cors());

// rate limit
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter); // apply to all requests

 // init passport
 app.use(passport.initialize());

 // seculity
 app.use(helmet());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/company', companyRouter);
app.use('/staff', staffRouter);       
app.use('/shop', shopRouter);

app.use(errorHandler);

module.exports = app;
