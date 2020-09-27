import { injectable } from 'tsyringe';
import { ObjectID } from 'mongodb';

import Service from '@shared/core/Service';
import Product from '@modules/product/infra/mongoose/schemas/Product';

interface Request {
  productCodeArray: string[]
}

interface Response {
  IsProductsExistents: boolean;
}

@injectable()
class IsProductsInArrayAreExistentsService implements Service<Request, Response> {
  async execute({ productCodeArray }: Request): Promise<Response> {
    let IsProductsExistents = true

    const invalidProductCodeArray = productCodeArray.filter(productCode=> !ObjectID.isValid(productCode));

    if(invalidProductCodeArray.length===0){
      const existentsProductsArray = await Product.find({'_id': { $in: productCodeArray }});

      if(existentsProductsArray){
        if(existentsProductsArray.length!==productCodeArray.length){
          IsProductsExistents = false;
        }
      }else{
        IsProductsExistents = false;
      }
    }else{
      IsProductsExistents = false;
    }

    return { IsProductsExistents } as Response;
  }
}

export default IsProductsInArrayAreExistentsService;
