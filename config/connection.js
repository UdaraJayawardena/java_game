/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

const {
  development, production, local, staging, release,
} = require('./config.json');

/* =================== Local Setup =================== */

const uri = `mongodb://${local.host}:${local.port}/${local.db}`;

const mongooseConnection = {
  dbName: local.db,
  user: local.username,
  pass: local.password,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/* =================== Development Setup =================== */

// const uri = `mongodb+srv://cluster0.42znz.mongodb.net/${development.db}?retryWrites=true/${development.db}`;

// const mongooseConnection = {
//   dbName: development.db,
//   user: development.username,
//   pass: development.password,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

/* =================== Staging Setup =================== */

// const uri = `mongodb+srv://cluster0.42znz.mongodb.net/${staging.db}?retryWrites=true/${staging.db}`;

// const mongooseConnection = {
//   dbName: staging.db,
//   user: staging.username,
//   pass: staging.password,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

/* =================== Release Setup =================== */

// const uri = `mongodb+srv://cluster0.42znz.mongodb.net/${release.db}?retryWrites=true/${release.db}`;

// const mongooseConnection = {
//   dbName: release.db,
//   user: release.username,
//   pass: release.password,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

const dbConnection = async () => {
  await mongoose.connect(uri, mongooseConnection);

  console.log('MongoDB Connected Successfully');
};

module.exports = dbConnection;
