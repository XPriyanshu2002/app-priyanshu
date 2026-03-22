const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    overview: {
      greeting: String,
      subheading: String,
      dueAmount: String,
      dueDate: String,
      paymentTitle: String,
      paymentHint: String,
      daysLeft: String,
      connectionTitle: String,
      connectionStatus: String,
      connectionNumber: String,
      connectionLabel: String,
      connectionDate: String,
    },
    energySummary: {
      title: String,
      cta: String,
      usageLabel: String,
      usageValue: String,
      usageDelta: String,
      usageDeltaIcon: String,
      usageComparison: String,
      ranges: [String],
      activeRange: String,
      chartAction: String,
      bars: [
        {
          month: String,
          height: Number,
        },
      ],
    },
    metricSummary: {
      averageLabel: String,
      averageValue: String,
      peakLabel: String,
      peakValue: String,
      comparisonTitle: String,
      currentLabel: String,
      currentValue: String,
      previousLabel: String,
      previousValue: String,
      savedLabel: String,
      savedProgress: Number,
    },
    alerts: [
      {
        id: String,
        serialNo: String,
        meterNumber: String,
        consumerName: String,
      },
    ],
    navItems: [
      {
        id: String,
        icon: String,
        label: String,
        active: Boolean,
      },
    ],
    menu: {
      userName: String,
      userId: String,
      version: String,
      items: [
        {
          id: String,
          icon: String,
          label: String,
          active: Boolean,
        },
      ],
      footerItems: [
        {
          id: String,
          icon: String,
          label: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
