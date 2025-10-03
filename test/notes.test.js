import { expect } from 'chai';
import request from 'supertest';
import app from '../server.js';
import Note from '../models/notes.js';
import User from '../models/user.js';

const baseUrl = '/api/notes';
let token;
let createdUserId;
let noteId;
const uniqueEmail = `testuser_${Date.now()}@example.com`;
const userPassword = '123456';

describe('Notes API', () => {
  // Before all tests, create a user and get token
  before(async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: userPassword,
      });

    token = res.body.authToken;
    const userRes = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${token}`);
    createdUserId = userRes.body._id;
  });

  // After all tests, clean up database
  after(async () => {
    await User.deleteOne({ email: uniqueEmail });
    await Note.deleteMany({ user: createdUserId });
  });

  afterEach(async () => {
    await Note.deleteMany({ user: createdUserId });
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post(`${baseUrl}/addnote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        description: 'This is a test note.',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Test Note');
    noteId = res.body._id;
  });

  it('should not create note without title', async () => {
    const res = await request(app)
      .post(`${baseUrl}/addnote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'No title here',
      });

    expect(res.status).to.equal(400);
  });

  it('should get all notes for the user', async () => {
    await request(app)
      .post(`${baseUrl}/addnote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        description: 'This is a test note.',
      });

    const res = await request(app)
      .get(`${baseUrl}/fetchallnotes`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    noteId = res.body[0]._id;
  });

  it('should update an existing note', async () => {
    const createRes = await request(app)
      .post(`${baseUrl}/addnote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Note', description: 'Old content' });

    const id = createRes.body._id;

    const res = await request(app)
      .put(`${baseUrl}/updatenote/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Note', description: 'Updated content' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('title', 'Updated Note');
  });

  it('should not update note with invalid ID', async () => {
    const res = await request(app)
      .put(`${baseUrl}/updatenote/invalidID123`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Note' });

    expect(res.status).to.equal(400);
  });

  it('should delete an existing note', async () => {
    const createRes = await request(app)
      .post(`${baseUrl}/addnote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', description: 'Delete me' });

    const id = createRes.body._id;

    const res = await request(app)
      .delete(`${baseUrl}/deletenote/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Note deleted successfully');
  });

  it('should not delete a non-existent note', async () => {
    const fakeId = '64b7f9f4f4d3c2a1b2c3d4e5';
    const res = await request(app)
      .delete(`${baseUrl}/deletenote/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', 'Note not found');
  });
});
