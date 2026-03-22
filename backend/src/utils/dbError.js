const RECOVERABLE_DB_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'PROTOCOL_CONNECTION_LOST',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNRESET',
  'ER_BAD_DB_ERROR',
  'ER_NO_SUCH_TABLE',
]);

const canUseInMemoryFallback =
  process.env.NODE_ENV !== 'production' && process.env.DISABLE_IN_MEMORY_FALLBACK !== 'true';

const isRecoverableDbError = (error) => canUseInMemoryFallback && RECOVERABLE_DB_ERROR_CODES.has(error?.code);

module.exports = {
  isRecoverableDbError,
};
