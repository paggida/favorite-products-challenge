import { container } from 'tsyringe';
import { DocumentQuery } from 'mongoose';

import Product, { ProductDocument} from '@modules/product/infra/mongoose/schemas/Product'
import IsDuplicateProductService from '@modules/product/services/IsDuplicateProductService';

const isDuplicateProductService = container.resolve(IsDuplicateProductService);
const productObject = {
  title: 'Product-Test-Jest',
  brand: 'Company-Test-Jest',
  image: 'http://www.images.com/test-jest-img.png',
  price: 99.99,
  review_score: 9.9,
};

describe('Validation of duplicate products.', () => {
  it('Should not be able to validate a product update that will generate the same records with different ids', async () => {
    const spy = jest.spyOn(Product, 'findOne').mockReturnValue({} as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isDuplicateProduct } = await isDuplicateProductService.execute({ productObject, ownProductCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateProduct).toBeTruthy();
  });
  it('Should be able to validate a product update that is new to the database.', async () => {
    const responseProduct: unknown = null;
    const spy = jest.spyOn(Product, 'findOne').mockReturnValue(responseProduct as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isDuplicateProduct } = await isDuplicateProductService.execute({ productObject, ownProductCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateProduct).toBeFalsy();
  });
  it('Should not be able to validate a product that is not new in the database.', async () => {
    const spy = jest.spyOn(Product, 'findOne').mockReturnValue({} as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isDuplicateProduct } = await isDuplicateProductService.execute({ productObject });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateProduct).toBeTruthy();
  });
  it('Should be able to validate that a new product is new in the database.', async () => {
    const responseProduct: unknown = null;
    const spy = jest.spyOn(Product, 'findOne').mockReturnValue(responseProduct as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isDuplicateProduct } = await isDuplicateProductService.execute({ productObject });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateProduct).toBeFalsy();
  });
});
