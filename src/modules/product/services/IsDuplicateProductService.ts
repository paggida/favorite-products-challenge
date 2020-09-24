import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';
import Product from '@modules/product/infra/mongoose/schemas/Product'

interface IFiltersObject {
  [key: string]: any
}

interface Request {
  productObject: {
    title: string,
    brand: string
  };
  ownProductCode?: string
}

interface Response {
  isDuplicateProduct: boolean;
}

@injectable()
class IsDuplicateProductService implements Service<Request, Response> {
  async execute({ productObject, ownProductCode }: Request): Promise<Response> {
    const { title, brand } = productObject;
    const filtersObject: IFiltersObject= {};

    filtersObject['title'] = new RegExp(`^${title}$`, "i");
    filtersObject['brand'] = new RegExp(`^${brand}$`, "i");

    if(ownProductCode){
      filtersObject['_id'] = { $ne: ownProductCode };
    }

    const product = await Product.findOne(filtersObject);

    const isDuplicateProduct = product? true:false;

    return { isDuplicateProduct } as Response;
  }
}

export default IsDuplicateProductService;
