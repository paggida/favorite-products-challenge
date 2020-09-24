import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ProductObjBodyError from '@modules/product/errors/ProductObjBodyError';
import DuplicatedProductError from '@modules/product/errors/DuplicatedProductError';
import IsValidProductObjectService from '@modules/product/services/IsValidProductObjectService';
import GetYupRulesSchemaForUpdateProduct from '@modules/product/services/GetYupRulesSchemaForUpdateProduct';
import IsDuplicateProductService from '@modules/product/services/IsDuplicateProductService';
import GetCleanProductObjService from '@modules/product/services/GetCleanProductObjectService';

const isValidProductObjService = container.resolve(IsValidProductObjectService);
const getYupRulesSchemaForUpdateProduct = container.resolve(GetYupRulesSchemaForUpdateProduct);
const isDuplicateProductService = container.resolve(IsDuplicateProductService);
const getCleanProductObjService = container.resolve(GetCleanProductObjService);

export default async function ensureUpdateProductBody( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { productCode } = req.params;

  const { schema } = getYupRulesSchemaForUpdateProduct.execute();
  const { isValidProductObj } = await isValidProductObjService.execute({
    productObject: req.body,
    yupRulesSchema: schema
  });

  if (isValidProductObj) {
    const { isDuplicateProduct } = await isDuplicateProductService.execute({
      productObject: req.body,
      ownProductCode: productCode
    });

    if (isDuplicateProduct) {

      const {statusCode, message} = new DuplicatedProductError('The updated product already exists.');
      return res.status(statusCode).json({ message });
    }
  }else{

    const {statusCode, message} = new ProductObjBodyError('Invalid body request.');
    return res.status(statusCode).json({ message });
  }

  const { cleanProductObject } = getCleanProductObjService.execute({
    productObject: req.body
  });

  req.body = cleanProductObject;

  return next();
}
