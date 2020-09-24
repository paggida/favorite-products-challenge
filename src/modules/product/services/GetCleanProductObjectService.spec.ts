import { container } from 'tsyringe';

import GetCleanProductObjectService from '@modules/product/services/GetCleanProductObjectService';

const getCleanProductObjectService = container.resolve(GetCleanProductObjectService);

describe('Validation of clearing the exclusive attributes on Product objects.', () => {
  it('Should be able to clean exclusive attributes of a valid object.', () => {
    const productObject = {
      _id: 'a1b2c3',
      title: 'Product-Test-Jest',
      brand: 'Company-Test-Jest',
      image: 'http://www.images.com/test-jest-img.png',
      price: 99.99,
      review_score: 9.9,
      createdAt: '2020-09-19T21:04:04.130Z',
      updatedAt: '2020-09-19T21:04:04.130Z',
      __v: 3
    };

    const { cleanProductObject } = getCleanProductObjectService.execute({ productObject });

    expect(cleanProductObject).not.toHaveProperty('_id');
    expect(cleanProductObject).not.toHaveProperty('createdAt');
    expect(cleanProductObject).not.toHaveProperty('updatedAt');
    expect(cleanProductObject).not.toHaveProperty('__v');
    expect(cleanProductObject).toHaveProperty('title','Product-Test-Jest');
    expect(cleanProductObject).toHaveProperty('brand','Company-Test-Jest');
    expect(cleanProductObject).toHaveProperty('image','http://www.images.com/test-jest-img.png');
    expect(cleanProductObject).toHaveProperty('price', 99.99);
    expect(cleanProductObject).toHaveProperty('review_score', 9.9);
  });
});
