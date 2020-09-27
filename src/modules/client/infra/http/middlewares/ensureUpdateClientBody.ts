import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ClientObjBodyError from '@modules/client/errors/ClientObjBodyError';
import DuplicatedClientError from '@modules/client/errors/DuplicatedClientError';
import IsValidClientObjectService from '@modules/client/services/IsValidClientObjectService';
import GetYupRulesSchemaForUpdateClient from '@modules/client/services/GetYupRulesSchemaForUpdateClient';
import IsDuplicateClientService from '@modules/client/services/IsDuplicateClientService';
import GetCleanClientObjService from '@modules/client/services/GetCleanClientObjectService';

const isValidClientObjService = container.resolve(IsValidClientObjectService);
const getYupRulesSchemaForUpdateClient = container.resolve(GetYupRulesSchemaForUpdateClient);
const isDuplicateClientService = container.resolve(IsDuplicateClientService);
const getCleanClientObjService = container.resolve(GetCleanClientObjService);

export default async function ensureUpdateClientBody( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { clientCode } = req.params;

  const { schema } = getYupRulesSchemaForUpdateClient.execute();
  const { isValidClientObj } = await isValidClientObjService.execute({
    clientObject: req.body,
    yupRulesSchema: schema
  });

  if (isValidClientObj) {
    const { isDuplicateClient } = await isDuplicateClientService.execute({
      clientObject: req.body,
      ownClientCode: clientCode
    });

    if (isDuplicateClient) {

      const {statusCode, message} = new DuplicatedClientError('The updated client already exists.');
      return res.status(statusCode).json({ message });
    }
  }else{

    const {statusCode, message} = new ClientObjBodyError('Invalid body request.');
    return res.status(statusCode).json({ message });
  }

  const { cleanClientObject } = getCleanClientObjService.execute({
    clientObject: req.body
  });

  req.body = cleanClientObject;

  return next();
}
