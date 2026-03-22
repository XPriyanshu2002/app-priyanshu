const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/authService');

jest.mock('../src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe('Auth API', () => {
  test('POST /api/register creates a user', async () => {
    authService.register.mockResolvedValue({ message: 'User registered successfully', userId: 10 });

    const response = await request(app)
      .post('/api/register')
      .send({ name: 'John', email: 'john@example.com', password: 'Password123!' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully', userId: 10 });
  });

  test('POST /api/register returns conflict on duplicate email', async () => {
    const error = new Error('User already exists with this email');
    error.statusCode = 409;
    authService.register.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/register')
      .send({ name: 'John', email: 'john@example.com', password: 'Password123!' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User already exists with this email');
  });

  test('POST /api/login returns token on valid credentials', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-token', consumerName: 'John' });

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'john@example.com', password: 'Password123!' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'jwt-token', consumerName: 'John' });
  });

  test('POST /api/login returns unauthorized on invalid credentials', async () => {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    authService.login.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'john@example.com', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
