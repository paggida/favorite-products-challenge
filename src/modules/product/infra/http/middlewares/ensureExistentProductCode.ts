import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import UnknownProductCodeError from '@modules/product/errors/UnknownProductCodeError';
import IsProductCodeExistsService from '@modules/product/services/IsProductCodeExistsService';

const isProductCodeExistsService = container.resolve(IsProductCodeExistsService);

export default async function ensureExistentProductCode( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { productCode } = req.params;

  const { isExistsProductCode } = await isProductCodeExistsService.execute({ productCode });

  if(isExistsProductCode){
    return next();
  }else{
    const {statusCode, message} = new UnknownProductCodeError('Product not found.');

    return res.status(statusCode).json({ message });
  }

}
