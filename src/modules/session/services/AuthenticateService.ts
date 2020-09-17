import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import authConfig from '@config/auth';
import Service from '@shared/core/Service';

interface Response {
  token: string;
}

@injectable()
class AuthenticateService implements Service<Request, Response> {
  async execute(): Promise<Response> {
    return {
      token: jwt.sign({}, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      })
    };
  }
}

export default AuthenticateService;
