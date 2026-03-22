const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ message });
};

module.exports = {
  notFound,
  errorHandler,
};
