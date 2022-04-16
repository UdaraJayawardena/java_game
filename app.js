/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('fitness-island-chat:server');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

// initialize database connection
const swaggerUi = require('swagger-ui-express');
const io = require('socket.io')(server, { cors: { origin: '*' } });

const dbConnection = require('./config/connection');

dbConnection();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('HTTP Working');
});

const routes = require('./src/routes/index');

const swaggerDocument = require('./src/swagger.json');

const options = { swaggerOptions: { docExpansion: 'none' } };
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options),
);

routes.forEach(([name, handler]) => app.use(`/${name}`, handler));

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

server.listen(port, () => {
  console.log(`Server Started On Port, ${port} ${process.env.NODE_ENV}`);
});

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

module.exports = app;
