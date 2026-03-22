const dashboardModel = require('../models/dashboardModel');

const VALID_RANGES = new Set(['7D', '30D', '90D', '1Y']);
const DEFAULT_RANGE = '30D';
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WOBBLE = [-1.2, -0.8, -0.4, 0.1, 0.6, 1.1, 0.7, 0.2, -0.2, 0.4];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeUsageSeed = (rawUsage) => {
  let usage = rawUsage || [];

  if (typeof usage === 'string') {
    try {
      usage = JSON.parse(usage);
    } catch (error) {
      usage = [];
    }
  }

  if (!Array.isArray(usage)) {
    return [];
  }

  return usage
    .map((entry) => (typeof entry === 'number' ? entry : toNumber(entry?.value, Number.NaN)))
    .filter((value) => Number.isFinite(value) && value >= 0);
};

const buildSeries = ({ count, labelBuilder, base, amplitude }) =>
  Array.from({ length: count }, (_, index) => {
    const wobble = WOBBLE[index % WOBBLE.length] * amplitude;
    return {
      label: labelBuilder(index),
      value: Number(Math.max(0, base + wobble).toFixed(2)),
    };
  });

const buildYearlySeries = ({ seedValues, monthlyBase }) =>
  MONTH_LABELS.map((label, index) => {
    const seed = seedValues[index % seedValues.length] || monthlyBase;
    const wobble = WOBBLE[index % WOBBLE.length] * 8;
    return {
      label,
      value: Number(Math.max(0, seed + wobble).toFixed(2)),
    };
  });

const buildUsageByRange = ({ range, seedValues, dailyBase, monthlyBase }) => {
  if (range === '7D') {
    return buildSeries({
      count: 7,
      labelBuilder: (index) => `D${index + 1}`,
      base: dailyBase,
      amplitude: 0.9,
    });
  }

  if (range === '30D') {
    return buildSeries({
      count: 30,
      labelBuilder: (index) => `D${index + 1}`,
      base: dailyBase,
      amplitude: 1.1,
    });
  }

  if (range === '90D') {
    return buildSeries({
      count: 13,
      labelBuilder: (index) => `W${index + 1}`,
      base: dailyBase * 7,
      amplitude: 4.2,
    });
  }

  return buildYearlySeries({ seedValues, monthlyBase });
};

const resolveRange = (requestedRange) => {
  if (!requestedRange) {
    return DEFAULT_RANGE;
  }

  const normalizedRange = String(requestedRange).trim().toUpperCase();
  if (!normalizedRange) {
    return DEFAULT_RANGE;
  }

  if (!VALID_RANGES.has(normalizedRange)) {
    const error = new Error('Invalid range. Allowed values: 7D, 30D, 90D, 1Y.');
    error.statusCode = 400;
    throw error;
  }

  return normalizedRange;
};

const getDashboard = async (userId, requestedRange) => {
  const range = resolveRange(requestedRange);
  let dashboard = await dashboardModel.getDashboardByUserId(userId);

  if (!dashboard) {
    await dashboardModel.createDefaultDashboardForUser(userId);
    dashboard = await dashboardModel.getDashboardByUserId(userId);
  }

  const safeDashboard = dashboard || {};
  const alerts = await dashboardModel.getAlertsByUserId(userId);
  const seedValues = normalizeUsageSeed(safeDashboard.monthlyUsage);
  const monthlyBase =
    seedValues.length > 0
      ? seedValues.reduce((sum, value) => sum + value, 0) / seedValues.length
      : 225;
  const derivedDailyBase = monthlyBase / 30;
  const dailyBase = toNumber(safeDashboard.avgDailyUsage, derivedDailyBase);

  const monthlyUsage = buildUsageByRange({
    range,
    seedValues: seedValues.length > 0 ? seedValues : [monthlyBase],
    dailyBase,
    monthlyBase,
  });

  return {
    balance: toNumber(safeDashboard.balance, 0),
    dueAmount: toNumber(safeDashboard.dueAmount, 0),
    dueDate: safeDashboard.dueDate,
    meterNumber: safeDashboard.meterNumber,
    lastCommunication: safeDashboard.lastCommunication,
    monthlyUsage,
    avgDailyUsage: toNumber(safeDashboard.avgDailyUsage, Number(dailyBase.toFixed(2))),
    peakUsage: toNumber(safeDashboard.peakUsage, 0),
    alerts,
  };
};

module.exports = {
  getDashboard,
};
