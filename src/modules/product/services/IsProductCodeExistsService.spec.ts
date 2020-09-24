import { container } from 'tsyringe';
import { DocumentQuery } from 'mongoose';

import Product, { ProductDocument} from '@modules/product/infra/mongoose/schemas/Product'
import IsProductCodeExistsService from '@modules/product/services/IsProductCodeExistsService';

const isProductCodeExistsService = container.resolve(IsProductCodeExistsService);

describe('Validation of validity and existence of a product code.', () => {
  it('Should not be able to verify an invalid product code.', async () => {
    const { isExistsProductCode } = await isProductCodeExistsService.execute({ productCode:'123' });

    expect(isExistsProductCode).toBeFalsy();
  });
  it('Should not be able to verify a valid and unknown product code.', async () => {
    const responseProduct: unknown = null;
    const spy = jest.spyOn(Product, 'findById').mockReturnValue(responseProduct as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isExistsProductCode } = await isProductCodeExistsService.execute({ productCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isExistsProductCode).toBeFalsy();
  });
  it('Should be able to verify a valid and existing product code.', async () => {
    const spy = jest.spyOn(Product, 'findById').mockReturnValue({} as DocumentQuery<ProductDocument | null, ProductDocument, {}>);

    const { isExistsProductCode } = await isProductCodeExistsService.execute({ productCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isExistsProductCode).toBeTruthy();
  });
});
