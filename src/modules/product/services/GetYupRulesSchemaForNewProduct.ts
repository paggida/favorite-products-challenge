import { injectable } from 'tsyringe';
import { Schema } from 'mongoose';
import * as yup from 'yup';

import Product from '@modules/product/infra/mongoose/schemas/Product'
import Service from '@shared/core/Service';

interface IRulesSchemma {
  [key: string]: any
}

interface IYupSchemma {
  isValid(value: any, options?: any): Promise<boolean>;
}

type Response = {
  schema: IYupSchemma
};

@injectable()
class GetYupRulesSchemaForNewProduct implements Service<Request, Response> {
  execute(): Response {
    const yupRulesSchema: IRulesSchemma = {};
    const requiredFields = Product.schema.requiredPaths();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
        if(requiredFields.indexOf(field)>=0){
          yupRulesSchema[field] = yup.string().strict(true).required();
        }else{
          yupRulesSchema[field] = yup.string().strict(true);
        }
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
        if(requiredFields.indexOf(field)>=0){
          yupRulesSchema[field] = yup.number().required();
        }else{
          yupRulesSchema[field] = yup.number();
        }
      }
    });

    const schema = Object.keys(yupRulesSchema).length === 0? yup.object() : yup.object().shape(yupRulesSchema);

    return { schema } as Response
  }
}

export default GetYupRulesSchemaForNewProduct;


