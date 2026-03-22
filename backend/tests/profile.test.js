const request = require('supertest');
const app = require('../src/app');
const profileService = require('../src/services/profileService');
const { signToken } = require('../src/utils/jwt');

jest.mock('../src/services/profileService', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
}));

describe('Profile API', () => {
  const token = signToken({ userId: 1, email: 'consumer@example.com', name: 'Test Consumer' });

  test('GET /api/profile returns current profile', async () => {
    profileService.getProfile.mockResolvedValue({ name: 'Test Consumer', email: 'consumer@example.com' });

    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'Test Consumer', email: 'consumer@example.com' });
  });

  test('PUT /api/profile updates profile', async () => {
    profileService.updateProfile.mockResolvedValue({
      message: 'Profile updated successfully',
      profile: { name: 'Updated Name', email: 'updated@example.com' },
    });

    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', email: 'updated@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile updated successfully');
  });
});
