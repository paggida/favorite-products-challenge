import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import authConfig from '@config/auth';
import AccessCodeAuthenticityError from '@modules/session/errors//AccessCodeAuthenticityError'
import AuthenticateService from '@modules/session/services/AuthenticateService';

describe('Validation of Authenticate Service.', () => {
  it('Should be able to get a JWT token with an valid access code.', async () => {
    let jwtVerify: boolean = false;

    const authService = container.resolve(AuthenticateService);
    const authServiceResponse = await authService.execute({ accessCode: authConfig.accessCode});
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

  it('Should not be able to get a JWT token with an invalid access code.', async () => {
    let isErrorHappened: boolean = false;
    let isIntanceOfAccessCodeAuthenticityError: boolean = false;

    try{
      const authService = container.resolve(AuthenticateService);
      await authService.execute({ accessCode: 'Jest_TestAccessCode' });
    }catch(err){
      isErrorHappened = true;
      isIntanceOfAccessCodeAuthenticityError = err instanceof AccessCodeAuthenticityError
    }

    expect(isErrorHappened).toBeTruthy();
    expect(isIntanceOfAccessCodeAuthenticityError).toBeTruthy();
  });
});
