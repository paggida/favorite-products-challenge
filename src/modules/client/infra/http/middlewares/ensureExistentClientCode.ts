import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import UnknownClientCodeError from '@modules/client/errors/UnknownClientCodeError';
import IsClientCodeExistsService from '@modules/client/services/IsClientCodeExistsService';

const isClientCodeExistsService = container.resolve(IsClientCodeExistsService);

export default async function ensureExistentClientCode( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { clientCode } = req.params;

  const { isExistsClientCode } = await isClientCodeExistsService.execute({ clientCode });

  if(isExistsClientCode){
    return next();
  }else{
    const {statusCode, message} = new UnknownClientCodeError('Client not found.');

    return res.status(statusCode).json({ message });
  }
}
