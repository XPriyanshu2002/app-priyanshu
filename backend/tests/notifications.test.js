const request = require('supertest');
const app = require('../src/app');
const notificationService = require('../src/services/notificationService');
const { signToken } = require('../src/utils/jwt');

jest.mock('../src/services/notificationService', () => ({
  getNotifications: jest.fn(),
}));

describe('Notifications API', () => {
  const token = signToken({ userId: 1, email: 'consumer@example.com', name: 'Test Consumer' });

  test('GET /api/notifications returns notification list', async () => {
    notificationService.getNotifications.mockResolvedValue({
      notifications: [
        {
          id: 1,
          type: 'BILL_DUE',
          title: 'Bill Due Reminder',
          description: 'Payment due this week',
          createdAt: '2026-03-07T09:00:00.000Z',
          isRead: 0,
        },
      ],
    });

    const response = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.notifications).toHaveLength(1);
  });
});
