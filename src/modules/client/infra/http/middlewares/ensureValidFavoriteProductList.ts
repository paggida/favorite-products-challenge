import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import UnknownFavoriteProductError from '@modules/client/errors/UnknownFavoriteProductError';
import GetArrayWithoutDuplicationService from '@modules/client/services/GetArrayWithoutDuplicationService';
import IsProductsInArrayAreExistentsService from '@modules/client/services/IsProductsInArrayAreExistentsService';

const getArrayWithoutDuplicationService = container.resolve(GetArrayWithoutDuplicationService);
const isProductsInArrayAreExistentsService = container.resolve(IsProductsInArrayAreExistentsService);

export default async function ensureValidFavoriteProductList( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { favorite_products } = req.body;

  if(favorite_products){
    const { arrayWithoutDUplication } = getArrayWithoutDuplicationService.execute({ array: favorite_products});
    const { IsProductsExistents } = await isProductsInArrayAreExistentsService.execute({ productCodeArray: arrayWithoutDUplication });

    if(IsProductsExistents){
      req.body.favorite_products = arrayWithoutDUplication;
    }else{
      const {statusCode, message} = new UnknownFavoriteProductError('Unknown product among favorites.');

      return res.status(statusCode).json({ message });
    }
  }

  return next();
}
