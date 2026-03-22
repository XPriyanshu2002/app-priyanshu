const request = require('supertest');
const app = require('../src/app');
const dashboardService = require('../src/services/dashboardService');
const { signToken } = require('../src/utils/jwt');

jest.mock('../src/services/dashboardService', () => ({
  getDashboard: jest.fn(),
}));

describe('Dashboard API', () => {
  const token = signToken({ userId: 1, email: 'consumer@example.com', name: 'Test Consumer' });
  const expectedPayload = {
    balance: 1200.5,
    dueAmount: 340.75,
    dueDate: '2026-03-12',
    meterNumber: 'MTR-000001',
    lastCommunication: '2026-03-06T10:00:00.000Z',
    monthlyUsage: [{ label: 'P1', value: 220 }],
    avgDailyUsage: 7.6,
    peakUsage: 12.2,
    alerts: [],
  };

  test('GET /api/dashboard requires auth token', async () => {
    const response = await request(app).get('/api/dashboard');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization token missing');
  });

  test.each(['7D', '30D', '90D', '1Y'])('GET /api/dashboard supports range %s', async (range) => {
    dashboardService.getDashboard.mockResolvedValue(expectedPayload);

    const response = await request(app)
      .get('/api/dashboard')
      .query({ range })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
        dueAmount: expect.any(Number),
        dueDate: expect.any(String),
        meterNumber: expect.any(String),
        lastCommunication: expect.any(String),
        monthlyUsage: expect.any(Array),
        avgDailyUsage: expect.any(Number),
        peakUsage: expect.any(Number),
      })
    );
    expect(dashboardService.getDashboard).toHaveBeenLastCalledWith(1, range);
  });

  test('GET /api/dashboard rejects invalid range values', async () => {
    const error = new Error('Invalid range. Allowed values: 7D, 30D, 90D, 1Y.');
    error.statusCode = 400;
    dashboardService.getDashboard.mockRejectedValue(error);

    const response = await request(app)
      .get('/api/dashboard')
      .query({ range: '2Y' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid range. Allowed values: 7D, 30D, 90D, 1Y.');
  });
});
