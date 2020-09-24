import { injectable } from 'tsyringe';
import { ObjectID } from 'mongodb';

import Service from '@shared/core/Service';
import Product from '@modules/product/infra/mongoose/schemas/Product'

interface Request {
  productCode: string;
}

interface Response {
  isExistsProductCode: boolean;
}

@injectable()
class IsProductCodeExistsService implements Service<Request, Response> {
  async execute({ productCode }: Request): Promise<Response> {
    let isExistsProductCode = false;

    if(ObjectID.isValid(productCode)){
      const product = await Product.findById(productCode);
      isExistsProductCode = product? true:false;
    }

    return { isExistsProductCode } as Response;
  }
}

export default IsProductCodeExistsService;
