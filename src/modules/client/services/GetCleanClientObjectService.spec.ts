import { container } from 'tsyringe';

import GetCleanClientObjectService from '@modules/client/services/GetCleanClientObjectService';

const getCleanClientObjectService = container.resolve(GetCleanClientObjectService);

describe('Validation of clearing the exclusive attributes on Client objects.', () => {
  it('Should be able to clean exclusive attributes of a valid object.', () => {
    const clientObject = {
      _id: 'a1b2c3',
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: [],
      createdAt: '2020-09-19T21:04:04.130Z',
      updatedAt: '2020-09-19T21:04:04.130Z',
      __v: 3
    };

    const { cleanClientObject } = getCleanClientObjectService.execute({ clientObject });

    expect(cleanClientObject).not.toHaveProperty('_id');
    expect(cleanClientObject).not.toHaveProperty('createdAt');
    expect(cleanClientObject).not.toHaveProperty('updatedAt');
    expect(cleanClientObject).not.toHaveProperty('__v');
    expect(cleanClientObject).toHaveProperty('favorite_products');
    expect(cleanClientObject).toHaveProperty('name','Client-Test-Jest');
    expect(cleanClientObject).toHaveProperty('email','client.test@jest.com');
  });
});
