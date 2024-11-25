const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');

const gloablErrorHandler = require(
  `${__dirname}/controllers/globalErrorHandler`,
);

const configRouter = require(`${__dirname}/routes/configRoute`);
const storiesRouter = require(`${__dirname}/routes/storiesRoute`);
const userRouter = require(`${__dirname}/routes/userRoute`);
const sourcesRouter = require(`${__dirname}/routes/sourcesRoute`);

const app = express();

//Implement CORS
app.use(cors());
//Access-control-Allow-Origin
app.options('*', cors());

//BODY PARSER
app.use(
  express.json({
    limit: '10kb',
  }),
);

//SET HTTP SECURITY HEADERS
app.use(helmet());

//data sanitaztion against no sql query injections
app.use(mongoSanitize());

//data sanitaztion against xss
app.use(xss());

//prevent paramter pollution
app.use(hpp());

//RATE LIMITING
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/config', configRouter);
app.use('/api/v1/stories', storiesRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/sources', sourcesRouter);
app.get('/api/v1/health', (req, resp, next) => {
  resp.status(200).json({
    status: 'UP',
  });
});

app.all('*', (req, resp, next) => {
  next(new AppError(`cannot find path ${req.originalUrl}`, 400));
});

app.use(gloablErrorHandler);

module.exports = app;
