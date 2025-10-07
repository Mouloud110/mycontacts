require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');

let app;
let token;
let userId;

beforeAll(async () => {
  const testMongoUri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
  
  if (!testMongoUri) {
    throw new Error('MONGODB_URI_TEST ou MONGODB_URI doit être défini dans .env');
  }
  
  await mongoose.connect(testMongoUri);
  app = require('../src/index');
  
  // Créer un utilisateur de test et obtenir le token
  const res = await request(app)
    .post('/auth/register')
    .send({ 
      email: `contacttest${Date.now()}@example.com`, 
      password: 'Test123!' 
    });
  
  token = res.body.token;
  userId = res.body.user._id || res.body.user.id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Contacts CRUD Tests', () => {
  
  let contactId;

  describe('POST /contacts', () => {
    
    it('devrait créer un nouveau contact', async () => {
      const res = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          phone: '0612345678'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.firstName).toBe('John');
      expect(res.body.lastName).toBe('Doe');
      
      contactId = res.body._id || res.body.id;
    });

    it('devrait refuser sans authentification', async () => {
      const res = await request(app)
        .post('/contacts')
        .send({ 
          firstName: 'Test', 
          lastName: 'User', 
          phone: '0612345678' 
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /contacts', () => {
    
    it('devrait récupérer la liste des contacts', async () => {
      const res = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('devrait refuser sans token', async () => {
      const res = await request(app).get('/contacts');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /contacts/:id', () => {
    
    it('devrait modifier un contact existant', async () => {
      const res = await request(app)
        .patch(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Jane',
          phone: '0698765432'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.firstName).toBe('Jane');
    });
  });

  describe('DELETE /contacts/:id', () => {
    
    it('devrait supprimer un contact', async () => {
      const res = await request(app)
        .delete(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });
});