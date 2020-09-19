import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import authConfig from '@config/auth';
import Service from '@shared/core/Service';
import AccessCodeAuthenticityError from '@modules/session/errors/AccessCodeAuthenticityError';

interface Request {
  accessCode: string;
}

interface Response {
  token: string;
}

@injectable()
class AuthenticateService implements Service<Request, Response> {
  execute({ accessCode }: Request): Response {

    if (accessCode === authConfig.accessCode) {
      return {
        token: jwt.sign({}, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        })
      } as Response;
    }else{
      throw new AccessCodeAuthenticityError('Access code does not valid.');
    }
  }
}

export default AuthenticateService;
