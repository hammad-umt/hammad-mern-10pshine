import { expect } from 'chai';
import request from 'supertest';
import app from '../server.js';
import User from '../models/user.js';
const baseUrl = '/api/users';
let token;
let createdUserId;
const uniqueEmail = `testuser_${Date.now()}@example.com`;
describe('Users API', () => {
  // ✅ Signup
  it('should register a new user', async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '123456'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('authToken');
  });

  // ❌ Signup fail (duplicate email)
  it('should not register user with existing email', async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '123456'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'User already exists');
  });

  // ✅ Login
  it('should login user with correct credentials', async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({
        email: uniqueEmail,
        password: '123456'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('authToken');
    token = res.body.authToken;
  });

  // ❌ Login fail
  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({
        email: uniqueEmail,
        password: 'wrongpass'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid credentials');
  });

  // ✅ Get user
  it('should get logged-in user', async () => {
    const res = await request(app)
      .get(`${baseUrl}/getUser`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('email', uniqueEmail);
    createdUserId = res.body._id;
  });

  // ✅ Update details
  it('should update user name', async () => {
    const res = await request(app)
      .put(`${baseUrl}/updateDetails`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'User details updated successfully');
    expect(res.body.user).to.have.property('name', 'Updated User');
  });

  // ✅ Change password
  it('should change user password', async () => {
    const res = await request(app)
      .put(`${baseUrl}/changePassword`)
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: '123456', newPassword: '654321' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Password updated successfully');
  });

  // ❌ Change password fail
  it('should fail with wrong old password', async () => {
    const res = await request(app)
      .put(`${baseUrl}/changePassword`)
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'wrong123', newPassword: '111111' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid current password');
  });

  // ❌ UpdateDetails fail (no fields)
  it('should fail to update without name or email', async () => {
    const res = await request(app)
      .put(`${baseUrl}/updateDetails`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Provide a name or email to update');
  });

  // Cleanup after tests
  after(async () => {
    await User.deleteOne({ email: uniqueEmail });
  });
});
