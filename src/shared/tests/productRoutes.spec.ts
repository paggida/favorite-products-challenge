import request from 'supertest';

import app from '@shared/infra/http/app';
import authConfig from '@config/auth';

let productCode: string;

describe('Validation of product creation.', () => {
  it('Should not be able to create a product without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .post(`/api/v1/product`)
      .send({});

      expect(status).toBe(401);
      expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to create a product with an invalid JWT token.', async () => {
      const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

      const {status, body} = await request(app)
        .post(`/api/v1/product`)
        .set('Authorization', `bearer ${Invalidtoken}`)
        .send({});

      expect(status).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to create a product using an invalid body request.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/product`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
  it('Should be able to create a valid product with a valid JWT token.', async () => {
    const newProduct = {
      title: 'Product-Test-Jest',
      brand: 'Company-Test-Jest',
      image: 'http://www.images.com/test-jest-img.png',
      price: 99.99,
      review_score: 9.9
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/product`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(newProduct);

    productCode = body.id;

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', productCode);
  });
  it('Should not be able to create a product that already exists.', async () => {
    const existsProduct = {
      title: 'Product-Test-Jest',
      brand: 'Company-Test-Jest',
      image: 'http://www.images.com/test-jest-img.png',
      price: 99.99,
      review_score: 9.9
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .post(`/api/v1/product`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(existsProduct);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Product already exist.');
  });
});

describe('Validation of product listing.', () => {
  it('Should not be able to list products without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .get(`/api/v1/product`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to list products with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .get(`/api/v1/product`)
      .set('Authorization', `bearer ${Invalidtoken}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should be able to list products with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/product`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('docs');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('limit');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pages');
  });
});

describe('Validation of search a product.', () => {
  it('Should not be able to search a product without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .get(`/api/v1/product/${productCode}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to search a product with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .get(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to search a product with an unknown code.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/product/999999999999999999999999`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Product not found.');
  });
  it('Should be able to search a valid product with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .get(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty('_id', productCode);
    expect(body).toHaveProperty('title', 'Product-Test-Jest');
    expect(body).toHaveProperty('brand', 'Company-Test-Jest');
    expect(body).toHaveProperty('image', 'http://www.images.com/test-jest-img.png');
    expect(body).toHaveProperty('price', 99.99);
    expect(body).toHaveProperty('review_score', 9.9);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });
});

describe('Validation of update a product.', () => {
  it('Should not be able to delete a product without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .put(`/api/v1/product/${productCode}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to delete a product with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .put(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`)
      .send({});

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to update a product to another that already exists.', async () => {
    const newProduct = {
      title: 'Product-Test-Jest-2',
      brand: 'Company-Test-Jest-2',
      image: 'http://www.images.com/test-jest-img-2.png',
      price: 99.99,
      review_score: 9.9
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const newProductResponse = await request(app)
      .post(`/api/v1/product`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(newProduct);

    const {status, body} = await request(app)
      .put(`/api/v1/product/${newProductResponse.body.id}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send({...newProduct, title: 'Product-Test-Jest', brand: 'Company-Test-Jest' });

    const deleteResponse = await request(app)
      .delete(`/api/v1/product/${newProductResponse.body.id}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(newProductResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'The updated product already exists.');
  });
  it('Should not be able to update a product using an invalid body request.', async () => {
    const invalidProductBody = {
      _id: 12,
      title: 123,
      brand: 1234,
      image: 12345,
      price: '999.99',
      review_score: '5.5',
      createdAt: 123456,
      updatedAt: 1234567
    };

    const tokenResponse = await request(app)
    .post(`/api/v1/session/token`)
    .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(invalidProductBody);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid body request.');
  });
  it('Should not be able to update a product with an unknown code.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/product/999999999999999999999999`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send({
        title: 'Product-Test-Jest',
        brand: 'Company-Test-Jest',
        image: 'http://www.images.com/test-jest-img.png',
        price: 99.99,
        review_score: 9.9
      });

      expect(status).toBe(404);
      expect(body).toHaveProperty('message', 'Product not found.');
  });
  it('Should be able to update a valid product with a valid JWT token.', async () => {
    const updateProduct = {
      title: 'Product-Test-Jest-Update',
      brand: 'Company-Test-Jest-Update',
      image: 'http://www.images.com/test-jest-img-update.png',
      price: 999.99,
      review_score: 5.5
    };

    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .put(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`)
      .send(updateProduct);

    expect(status).toBe(200);
    expect(body).toHaveProperty('_id', productCode);
    expect(body).toHaveProperty('title', 'Product-Test-Jest-Update');
    expect(body).toHaveProperty('brand', 'Company-Test-Jest-Update');
    expect(body).toHaveProperty('image', 'http://www.images.com/test-jest-img-update.png');
    expect(body).toHaveProperty('price', 999.99);
    expect(body).toHaveProperty('review_score', 5.5);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
    expect(body.updatedAt).not.toEqual(body.createdAt);
  });
});

describe('Validation of deleting a product.', () => {
  it('Should not be able to delete a product without a valid JWT token.', async () => {
    const {status, body} = await request(app)
      .delete(`/api/v1/product/${productCode}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'JWT token is missing.');
  });
  it('Should not be able to delete a product with an invalid JWT token.', async () => {
    const Invalidtoken = '999999999999999999999999999999999999.99999999999999999999999999999999999999999999999.9999999999999999999999-99999999999999999999';

    const {status, body} = await request(app)
      .delete(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${Invalidtoken}`);

    expect(status).toBe(401);
    expect(body).toHaveProperty('message', 'Invalid JWT token.');
  });
  it('Should not be able to delete a product with an unknown code.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status, body} = await request(app)
      .delete(`/api/v1/product/999999999999999999999999`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'Product not found.');
  });
  it('Should be able to delete a valid product with a valid JWT token.', async () => {
    const tokenResponse = await request(app)
      .post(`/api/v1/session/token`)
      .send({ accessCode: authConfig.accessCode});

    const {status} = await request(app)
      .delete(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

    const searchResponse = await request(app)
      .get(`/api/v1/product/${productCode}`)
      .set('Authorization', `bearer ${tokenResponse.body.token}`);

      expect(status).toBe(200);
      expect(searchResponse.status).toBe(404);
      expect(searchResponse.body).toHaveProperty('message', 'Product not found.');
  });
});
