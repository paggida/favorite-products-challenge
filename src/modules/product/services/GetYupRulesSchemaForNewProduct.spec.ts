import { container } from 'tsyringe';
import { Schema } from 'mongoose';

import Product from '@modules/product/infra/mongoose/schemas/Product'
import GetYupRulesSchemaForNewProduct from '@modules/product/services/GetYupRulesSchemaForNewProduct';

const getYupRulesSchemaForNewProduct = container.resolve(GetYupRulesSchemaForNewProduct);

interface IMockNewProduct {
  [key: string]: any
}

describe('Validation of the Yup object for validating new products.', () => {
  it('Should be able to validate a valid Product object with the received Yup schema.', async() => {
    let newProduct:IMockNewProduct={};

    const { schema } = getYupRulesSchemaForNewProduct.execute();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
        newProduct[field] = "Jest_Test_String";
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
        newProduct[field] = 9;
      }
    });

    const isValidProductObj = await schema.isValid(newProduct);

    expect(isValidProductObj).toBeTruthy();
  });
  it('Should not be able to validate a Product object without the required fields using the received Yup schema.', async() => {
    const requiredFields = Product.schema.requiredPaths();
    let newProduct:IMockNewProduct={};

    const { schema } = getYupRulesSchemaForNewProduct.execute();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
        if(requiredFields.indexOf(field)<0){
          newProduct[field] = "Jest_Test_String";
        }
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
        if(requiredFields.indexOf(field)<0){
          newProduct[field] = 9;
        }
      }
    });

    const isValidProductObj = await schema.isValid(newProduct);

    expect(isValidProductObj).toBeFalsy();
  });
  it('Should not be able to validate a Product object without the correct fields type using the received Yup schema.', async() => {
    let newProduct:IMockNewProduct={};

    const { schema } = getYupRulesSchemaForNewProduct.execute();

    Product.schema.eachPath(field => {
      if(Product.schema.paths[field] instanceof Schema.Types.String){
        newProduct[field] = 9;
      }
      if(Product.schema.paths[field] instanceof Schema.Types.Number){
        newProduct[field] = "Jest_Test_String";
      }
    });

    const isValidProductObj = await schema.isValid(newProduct);

    expect(isValidProductObj).toBeFalsy();
  });
});
