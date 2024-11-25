const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './.env',
});

const app = require(`${__dirname}/app`);

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💣');
  console.log(err);

  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.set('strictQuery', false);

(async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    //  useCreateIndex: true,
    //  useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('CONNECTION SUCCESSFULL!!!');
})();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💣');
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
