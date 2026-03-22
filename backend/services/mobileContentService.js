const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Bill Accurately.www\nOperate Confidently.',
    description:
      'Say goodbye to estimation errors. Our smart metering solutions ensure transparent, compliant, and error-free billing at scale.',
  },
  {
    id: '2',
    title: 'Install with Confidence.\nEvery Time.',
    description:
      'Every meter is linked, verified, and geo-tagged - ensuring accurate installation with complete traceability.',
  },
  {
    id: '3',
    title: 'Commission Quickly.\nComply Fully.',
    description:
      'Test, validate, and report in just a few steps - making compliance faster, smoother, and always audit-ready.',
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    title: 'Low Balance Alert',
    message: 'Your meter balance is below Rs 100. Recharge now to avoid disconnection.',
  },
  {
    title: 'Upcoming Due Date',
    message: 'Your bill of Rs 3,180 is due on 10 May. Pay now to avoid late fees.',
  },
  {
    title: 'Payment Successful',
    message: 'Rs 3,180 received. Thank you for staying current.',
  },
];

function getOnboardingSlides() {
  return ONBOARDING_SLIDES;
}

function getDefaultNotifications() {
  return DEFAULT_NOTIFICATIONS;
}

module.exports = { getDefaultNotifications, getOnboardingSlides };
