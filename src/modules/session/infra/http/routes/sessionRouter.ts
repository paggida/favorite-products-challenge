import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateService from '@modules/session/services/AuthenticateService';

const sessionRouter = Router();

sessionRouter.get('/token', async (req, res) => {
  const authService = container.resolve(AuthenticateService);

  return res.json(await authService.execute());
});

export default sessionRouter;
