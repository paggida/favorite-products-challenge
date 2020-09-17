import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import authConfig from '@config/auth';
import AuthenticateService from '@modules/session/services/AuthenticateService';

describe('Validation of Authenticate Service.', () => {
  it('should be able to get a valid JWT token.', async () => {
    let jwtVerify: boolean = false;

    const authService = container.resolve(AuthenticateService);
    const authServiceResponse = await authService.execute();
    const { token } = authServiceResponse;

    try {
      jwt.verify(token, authConfig.secret);
      jwtVerify = true;
    } catch {
      jwtVerify = false;
    }

    expect(authServiceResponse).toHaveProperty('token');
    expect(jwtVerify).toBeTruthy();
  });
});
