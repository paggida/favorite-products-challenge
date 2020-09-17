import express from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const clientRouter = express.Router();

clientRouter.get('/', async (req, res) => {
  return res.json({ message: 'Response without token.'});
});

clientRouter.use(ensureAuthenticated);

clientRouter.get('/token', async (req, res) => {
  return res.json({ message: 'Response with token.'});
});

export default clientRouter;
