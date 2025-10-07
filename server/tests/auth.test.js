require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');

let app;

beforeAll(async () => {
  const testMongoUri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
  
  if (!testMongoUri) {
    throw new Error('MONGODB_URI_TEST ou MONGODB_URI doit être défini dans .env');
  }
  
  await mongoose.connect(testMongoUri);
  app = require('../src/index');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication Tests', () => {
  
  describe('POST /auth/register', () => {
    
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'Password123!'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('devrait refuser un email invalide', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    
    it('devrait connecter un utilisateur existant', async () => {
      const email = `login${Date.now()}@test.com`;
      await request(app)
        .post('/auth/register')
        .send({ email, password: 'Pass123!' });

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password: 'Pass123!' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('devrait refuser un mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ 
          email: 'nonexistent@test.com', 
          password: 'WrongPassword!' 
        });

      expect(res.statusCode).toBe(401);
    });
  });
});