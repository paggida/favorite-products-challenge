import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import * as yup from 'yup';

import ProductObjBodyError from '@modules/product/errors/ProductObjBodyError';
import DuplicatedProductError from '@modules/product/errors/DuplicatedProductError';
import IsValidProductObjService from '@modules/product/services/IsValidProductObjectService';
import GetYupRulesSchemaForNewProduct from '@modules/product/services/GetYupRulesSchemaForNewProduct';
import IsDuplicateProductService from '@modules/product/services/IsDuplicateProductService';
import GetCleanProductObjService from '@modules/product/services/GetCleanProductObjectService';

const isValidProductObjService = container.resolve(IsValidProductObjService);
const getYupRulesSchemaForNewProduct = container.resolve(GetYupRulesSchemaForNewProduct);
const isDuplicateProductService = container.resolve(IsDuplicateProductService);
const getCleanProductObjService = container.resolve(GetCleanProductObjService);

export default async function ensureNewProductBody( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { schema } = getYupRulesSchemaForNewProduct.execute();
  const { isValidProductObj } = await isValidProductObjService.execute({
    productObject: req.body,
    yupRulesSchema: schema
  });

  if (isValidProductObj) {
    const { isDuplicateProduct } = await isDuplicateProductService.execute({
      productObject: req.body
    });

    if (isDuplicateProduct) {

      const {statusCode, message} = new DuplicatedProductError('Product already exist.');
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
