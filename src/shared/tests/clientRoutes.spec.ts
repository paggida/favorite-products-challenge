import request from 'supertest';

import app from '@shared/infra/http/app';
import authConfig from '@config/auth';

let clientCode: string;

describe('Validation of client creation.', () => {
  it('Should not be able to create a client without a valid JWT token.', async () => {
    const {status, body} = await request(app)
    .post(`/api/v1/client`)
    .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to create a client with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${Invalidtoken}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to create a client using an invalid body request.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
  it('Should not be able to create a client with an unknown product in the favorite list.', async () => {
    const existsClient = {
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: ['999999999999999999999999']
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(existsClient);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Unknown product among favorites.');
  });
  it('Should be able to create a valid client with a valid JWT token.', async () => {
    const newClient = {
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: []
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(newClient);

    clientCode = body.id;

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', clientCode)
  });
  it('Should not be able to create a client that already exists.', async () => {
    const existsClient = {
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: []
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(existsClient);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Client already exist.');
  });
});

describe('Validation of client listing.', () => {
  it('Should not be able to list clients without a valid JWT token.', async () => {
    const {status, body} = await request(app)
    .get(`/api/v1/client`)
    .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to list clients with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .get(`/api/v1/client`)
      .set('Authorization', `bearer ${Invalidtoken}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should be able to list clients with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('docs');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pages');
  });
});

describe('Validation of search a client.', () => {
  it('Should not be able to search a client without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .get(`/api/v1/client/${clientCode}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to search a client with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .get(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to search a client with an unknown code.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/client/999999999999999999999999`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Client not found.');
  });
  it('Should be able to search a valid client with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('_id', clientCode);
    expect(body).toHaveProperty('name', 'Client-Test-Jest');
    expect(body).toHaveProperty('email', 'client.test@jest.com');
    expect(body).toHaveProperty('favorite_products');
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });
});

describe('Validation of update a client.', () => {
  it('Should not be able to delete a client without a valid JWT token.', async () => {
    const {status, body} = await request(app)
    .put(`/api/v1/client/${clientCode}`)
    .send({});

  expect(status).toBe(401);
  expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to delete a client with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .put(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to update a client to another that already exists.', async () => {
    const newClient = {
      name: 'Client-Test-Jest-2',
      email: 'client.test-2@jest.com',
      favorite_products: []
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const newClientResponse = await request(app)
      .post(`/api/v1/client`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(newClient);

    const {status, body} = await request(app)
      .put(`/api/v1/client/${newClientResponse.body.id}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send({...newClient, name: 'Client-Test-Jest', email: 'client.test@jest.com' });

    const deleteResponse = await request(app)
      .delete(`/api/v1/client/${newClientResponse.body.id}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(newClientResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'The updated client already exists.');
  });
  it('Should not be able to update a client using an invalid body request.', async () => {
    const invalidClientBody = {
      name: 123,
      email: '',
      favorite_products: []
    };

    const tokenResponse = await request(app)
    .post(`/api/v1/session/token`)
    .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(invalidClientBody);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
  it('Should not be able to update a client with an unknown code.', async () => {
    const tokenResponse = await request(app)
    .post(`/api/v1/session/token`)
    .send({ accessCode: authConfig.accessCode});

  const {status, body} = await request(app)
    .put(`/api/v1/client/999999999999999999999999`)
    .set('Authorization', `bearer ${tokenResponse.body.token}`)
    .send({
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: []
    });

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Client not found.');
  });
  it('Should not be able to update a client with an unknown product in the favorite list.', async () => {
    const newClient = {
      favorite_products: ['999999999999999999999999']
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(newClient);

      expect(status).toBe(404);
      expect(body).toHaveProperty('message', 'Unknown product among favorites.');
  });
  it('Should be able to update a valid client with a valid JWT token.', async () => {
    const updateClient = {
      name: 'Client-Test-Jest-Update',
      email: 'client.test-Update@jest.com',
      favorite_products: []
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(updateClient);

    expect(status).toBe(200);
    expect(body).toHaveProperty('_id', clientCode);
    expect(body).toHaveProperty('name', 'Client-Test-Jest-Update');
    expect(body).toHaveProperty('email', 'client.test-update@jest.com');
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
    expect(body.updatedAt).not.toEqual(body.createdAt);
  });
});

describe('Validation of deleting a client.', () => {
  it('Should not be able to delete a client without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .delete(`/api/v1/client/${clientCode}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to delete a client with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .delete(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to delete a client with an unknown code.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .delete(`/api/v1/client/999999999999999999999999`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Client not found.');
  });
  it('Should be able to delete a valid client with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status} = await request(app)
      .delete(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    const searchResponse = await request(app)
      .get(`/api/v1/client/${clientCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

      expect(status).toBe(200);
      expect(searchResponse.status).toBe(404);
      expect(searchResponse.body).toHaveProperty('message', 'Client not found.');
  });
});
