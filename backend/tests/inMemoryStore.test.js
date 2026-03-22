const inMemoryStore = require('../src/store/inMemoryStore');

describe('inMemoryStore notification defaults', () => {
  test('creates all required notification types', () => {
    const userId = 9090;
    inMemoryStore.createDefaultNotificationsForUser(userId);

    const notifications = inMemoryStore.getNotificationsByUserId(userId);
    const types = new Set(notifications.map((item) => item.type));

    expect(notifications).toHaveLength(5);
    expect(types).toEqual(
      new Set(['BILL_DUE', 'PAYMENT_CONFIRMATION', 'LOW_BALANCE', 'SYSTEM_ALERT', 'TICKET_UPDATE'])
    );
  });
});
