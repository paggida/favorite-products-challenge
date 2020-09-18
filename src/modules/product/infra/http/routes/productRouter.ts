import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const productRouter = Router();

productRouter.use(ensureAuthenticated);

productRouter.get('/', async (req, res) => {
  return res.status(501).json({ message: `All route`});
});

productRouter.get('/:productCode', async (req, res) => {
  const { productCode } = req.params;

  return res.status(501).json({ productCode, message: `Search route`});
});

productRouter.post('/', async (req, res) => {
  const newproduct = req.body;
  return res.status(501).json({ message: `Create route.`, data: newproduct });
});

productRouter.put('/:productCode', async (req, res) => {
  const { productCode } = req.params;
  const updateproduct = req.body;

  return res.status(501).json({ productCode, message: `Update route.`, data: updateproduct });
});

productRouter.delete('/:productCode', async (req, res) => {
  const { productCode } = req.params;

  return res.status(501).json({ productCode, message: `Delete route.`});
});

export default productRouter;
