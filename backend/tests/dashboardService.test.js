const dashboardService = require('../src/services/dashboardService');
const dashboardModel = require('../src/models/dashboardModel');

jest.mock('../src/models/dashboardModel', () => ({
  getDashboardByUserId: jest.fn(),
  createDefaultDashboardForUser: jest.fn(),
  getAlertsByUserId: jest.fn(),
}));

describe('dashboardService.getDashboard', () => {
  const baseDashboard = {
    meterNumber: 'MTR-000001',
    balance: 1200.5,
    dueAmount: 340.75,
    dueDate: '2026-03-12',
    lastCommunication: '2026-03-06T10:00:00.000Z',
    monthlyUsage: JSON.stringify([
      { label: 'Jan', value: 220 },
      { label: 'Feb', value: 235 },
      { label: 'Mar', value: 228 },
      { label: 'Apr', value: 250 },
    ]),
    avgDailyUsage: 7.6,
    peakUsage: 12.2,
  };

  beforeEach(() => {
    dashboardModel.getDashboardByUserId.mockResolvedValue(baseDashboard);
    dashboardModel.getAlertsByUserId.mockResolvedValue([
      {
        id: 1,
        meterSerialNumber: 'MTR-000001',
        consumerName: 'Test Consumer',
        message: 'Bill due in 5 days',
      },
    ]);
  });

  test.each([
    ['7D', 7],
    ['30D', 30],
    ['90D', 13],
    ['1Y', 12],
  ])('returns shaped usage for %s', async (range, pointCount) => {
    const payload = await dashboardService.getDashboard(1, range);

    expect(payload).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
        dueAmount: expect.any(Number),
        dueDate: expect.any(String),
        meterNumber: expect.any(String),
        lastCommunication: expect.any(String),
        avgDailyUsage: expect.any(Number),
        peakUsage: expect.any(Number),
        alerts: expect.any(Array),
      })
    );
    expect(payload.monthlyUsage).toHaveLength(pointCount);
    expect(payload.monthlyUsage[0]).toEqual(
      expect.objectContaining({
        label: expect.any(String),
        value: expect.any(Number),
      })
    );
  });

  test('uses 30D shape when range is omitted', async () => {
    const payload = await dashboardService.getDashboard(1);
    expect(payload.monthlyUsage).toHaveLength(30);
  });

  test('throws validation error for invalid range', async () => {
    await expect(dashboardService.getDashboard(1, '2Y')).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid range. Allowed values: 7D, 30D, 90D, 1Y.',
    });
  });
});
