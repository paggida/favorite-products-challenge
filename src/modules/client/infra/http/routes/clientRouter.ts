import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const clientRouter = Router();

clientRouter.use(ensureAuthenticated);

clientRouter.get('/', async (req, res) => {
  return res.status(501).json({ message: `All route`});
});

clientRouter.get('/:clientCode', async (req, res) => {
  const { clientCode } = req.params;

  return res.status(501).json({ clientCode, message: `Search route`});
});

clientRouter.post('/', async (req, res) => {
  const newClient = req.body;
  return res.status(501).json({ message: `Create route.`, data: newClient });
});

clientRouter.put('/:clientCode', async (req, res) => {
  const { clientCode } = req.params;
  const updateClient = req.body;

  return res.status(501).json({ clientCode, message: `Update route.`, data: updateClient });
});

clientRouter.delete('/:clientCode', async (req, res) => {
  const { clientCode } = req.params;

  return res.status(501).json({ clientCode, message: `Delete route.`});
});

export default clientRouter;
