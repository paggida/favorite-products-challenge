import { container } from 'tsyringe';
import { DocumentQuery } from 'mongoose';

import Product, { ProductDocument} from '@modules/product/infra/mongoose/schemas/Product';
import IsProductsInArrayAreExistentsService from '@modules/client/services/IsProductsInArrayAreExistentsService';

const isProductsInArrayAreExistentsService = container.resolve(IsProductsInArrayAreExistentsService);

describe('Validation of the existence of all product codes in the array.', () => {
  it('Should not be able to validate an array containing unknown product codes.', async () => {
    const productCodeArray = ['999999999999999999999999']
    const responseClient: unknown = null;
    const spy = jest.spyOn(Product, 'find').mockReturnValue(responseClient as DocumentQuery<ProductDocument[], ProductDocument, {}>);

    const { IsProductsExistents } = await isProductsInArrayAreExistentsService.execute({ productCodeArray });

    expect(spy).toHaveBeenCalled();
    expect(IsProductsExistents).toBeFalsy();
  });
  it('Should not be able to validate an array containing an invalid product code.', async () => {
    const productCodeArray = ['123'];

    const { IsProductsExistents } = await isProductsInArrayAreExistentsService.execute({ productCodeArray });

    expect(IsProductsExistents).toBeFalsy();
  });
  it('Should be able to validate an array containing only existing product codes.', async () => {
    const productCodeArray = ['551137c2f9e1fac808a5f572']

    Product.find = jest.fn().mockResolvedValue([{
      _id: "a1b2c3",
      name: "José",
      email: "jose@fp.com",
      favorite_products: ["551137c2f9e1fac808a5f572"],
      createdAt: "2020-09-19T21:04:04.130Z",
      updatedAt: "2020-09-19T21:04:04.130Z"
    }]);

    const { IsProductsExistents } = await isProductsInArrayAreExistentsService.execute({ productCodeArray });

    expect(IsProductsExistents).toBeTruthy();
  });
});
