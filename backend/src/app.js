const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
