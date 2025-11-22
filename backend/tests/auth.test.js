const request = require('supertest');
const app = require('../testApp');
describe('Auth & Protected', ()=>{
  it('registers an org and returns token', async ()=>{
    const res = await request(app).post('/api/auth/register').send({ orgName:'T', adminName:'A', email:'t@a.com', password:'p' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it('login fails for bad creds', async ()=>{
    const res = await request(app).post('/api/auth/login').send({ email:'no@no', password:'x' });
    expect(res.statusCode).toBe(401);
  });
});
