/**
 * Minimal structured logger (no external deps).
 *
 * Usage:
 *   const logger = require('./utils/logger');
 *   logger.info('Server started', { port: 5000 })
 */

const LEVELS = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const levelFromEnv = (value) => {
  const key = String(value || "info").toLowerCase();
  return Object.prototype.hasOwnProperty.call(LEVELS, key) ? key : "info";
};

const LOG_LEVEL = levelFromEnv(process.env.LOG_LEVEL);

const ts = () => new Date().toISOString();

const format = (level, message, meta) => {
  const base = {
    ts: ts(),
    level,
    msg: message,
  };
  if (meta && typeof meta === "object" && Object.keys(meta).length > 0) {
    return JSON.stringify({ ...base, ...meta });
  }
  return JSON.stringify(base);
};

const shouldLog = (level) => LEVELS[level] <= LEVELS[LOG_LEVEL];

const logger = {
  level: LOG_LEVEL,
  error(message, meta) {
    if (!shouldLog("error")) return;
    // stderr
    console.error(format("error", message, meta));
  },
  warn(message, meta) {
    if (!shouldLog("warn")) return;
    console.warn(format("warn", message, meta));
  },
  info(message, meta) {
    if (!shouldLog("info")) return;
    console.log(format("info", message, meta));
  },
  debug(message, meta) {
    if (!shouldLog("debug")) return;
    console.log(format("debug", message, meta));
  },
};

module.exports = logger;
