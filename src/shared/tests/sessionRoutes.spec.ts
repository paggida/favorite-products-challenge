import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@shared/infra/http/app';
import authConfig from '@config/auth';

describe('Validation of obtaining a token.', () => {
  it('Should be able to get JWT token with an valid access code.', async () => {
    let jwtVerify: boolean = false;

    const bodyRequest = {
      accessCode: authConfig.accessCode
    }

    const {status, body} = await request(app)
      .post(`/api/v1/session/token`)
      .send(bodyRequest);

      try {
        jwt.verify(body.token, authConfig.secret);
        jwtVerify = true;
      } catch {
        jwtVerify = false;
      }

    expect(status).toBe(200);
    expect(body).toHaveProperty('token');
    expect(jwtVerify).toBeTruthy();
  });
  it('Should not be able to get a JWT token with an invalid access code.', async () => {
    const bodyRequest = {
      accessCode: 'Jest_TestAccessCode'
    }

    const {status, body} = await request(app)
      .post(`/api/v1/session/token`)
      .send(bodyRequest);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Access code does not valid.');
  });
  it('Should not be able to get a JWT token with an invalid data body request.', async () => {
    const bodyRequest = {
      accessCode: 123
    }

    const {status, body} = await request(app)
      .post(`/api/v1/session/token`)
      .send(bodyRequest);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
  it('Should not be able to get a JWT token with an invalid attribute body request.', async () => {
    const bodyRequest = {
      password: authConfig.accessCode
    }

    const {status, body} = await request(app)
      .post(`/api/v1/session/token`)
      .send(bodyRequest);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
});
