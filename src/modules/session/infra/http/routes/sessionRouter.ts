import { Router } from 'express';
import { container } from 'tsyringe';

import AccessCodeAuthenticityError from '@modules/session/errors/AccessCodeAuthenticityError';
import ensureBodyInput from '@modules/session/infra/http/middlewares/ensureBodyInput';
import AuthenticateService from '@modules/session/services/AuthenticateService';

const sessionRouter = Router();

sessionRouter.post('/token', ensureBodyInput, async (req, res) => {
  const { accessCode } = req.body;

  try{

    const authService = container.resolve(AuthenticateService);

    return res.json(await authService.execute({ accessCode }));

  }catch(err){
    if (err instanceof AccessCodeAuthenticityError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
  }


});

export default sessionRouter;
