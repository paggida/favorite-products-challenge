import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

import AccessCodeBodyError from '@modules/session/errors/AccessCodeBodyError';

export default async function ensureBodyInput(req: Request, res: Response, next: NextFunction): Promise<object | void> {
  const schema = yup.object().shape({
    accessCode: yup.string().strict(true).required(),
  });

  if (!(await schema.isValid(req.body))) {
    const {statusCode, message} = new AccessCodeBodyError('Invalid body request.')
    return res.status(statusCode).json({ message });
  }

  return next();
}
