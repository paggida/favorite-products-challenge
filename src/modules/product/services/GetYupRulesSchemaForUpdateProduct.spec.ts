import { container } from 'tsyringe';
import { Schema } from 'mongoose';

import Product from '@modules/product/infra/mongoose/schemas/Product'
import GetYupRulesSchemaForUpdateProduct from '@modules/product/services/GetYupRulesSchemaForUpdateProduct';

const getYupRulesSchemaForUpdateProduct = container.resolve(GetYupRulesSchemaForUpdateProduct);

interface IMockUpdateProduct {
  [key: string]: any
}

describe('Validation of the Yup object for validating update products.', () => {
  it('Should be able to validate a valid Product object with the received Yup schema.', async() => {
    let updateProduct:IMockUpdateProduct={};

    const { schema } = getYupRulesSchemaForUpdateProduct.execute();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
        updateProduct[field] = "Jest_Test_String";
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
        updateProduct[field] = 9;
      }
    });

    const isValidProductObj = await schema.isValid(updateProduct);

    expect(isValidProductObj).toBeTruthy();
  });
  it('Should not be able to validate an invalid Product object with the received Yup schema.', async() => {
    let updateProduct:IMockUpdateProduct={};

    const { schema } = getYupRulesSchemaForUpdateProduct.execute();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
          updateProduct[field] = 9;
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
          updateProduct[field] = "Jest_Test_String";
      }
    });

    const isValidProductObj = await schema.isValid(updateProduct);

    expect(isValidProductObj).toBeFalsy();
  });
});
