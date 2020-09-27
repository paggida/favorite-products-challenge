import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ClientObjBodyError from '@modules/client/errors/ClientObjBodyError';
import DuplicatedClientError from '@modules/client/errors/DuplicatedClientError';
import IsValidClientObjService from '@modules/client/services/IsValidClientObjectService';
import GetYupRulesSchemaForNewClient from '@modules/client/services/GetYupRulesSchemaForNewClient';
import IsDuplicateClientService from '@modules/client/services/IsDuplicateClientService';
import GetCleanClientObjService from '@modules/client/services/GetCleanClientObjectService';

const isValidClientObjService = container.resolve(IsValidClientObjService);
const getYupRulesSchemaForNewClient = container.resolve(GetYupRulesSchemaForNewClient);
const isDuplicateClientService = container.resolve(IsDuplicateClientService);
const getCleanClientObjService = container.resolve(GetCleanClientObjService);

export default async function ensureNewClientBody( req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const { schema } = getYupRulesSchemaForNewClient.execute();
  const { isValidClientObj } = await isValidClientObjService.execute({
    clientObject: req.body,
    yupRulesSchema: schema
  });

  if (isValidClientObj) {
    const { isDuplicateClient } = await isDuplicateClientService.execute({
      clientObject: req.body
    });

    if (isDuplicateClient) {

      const {statusCode, message} = new DuplicatedClientError('Client already exist.');
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
