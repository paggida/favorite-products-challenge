import { Router } from 'express';

import Client from '@modules/client/infra/mongoose/schemas/Client'
import ensureExistentClientCode from '@modules/client/infra/http/middlewares/ensureExistentClientCode'
import ensureNewClientBody from '@modules/client/infra/http/middlewares/ensureNewClientBody'
import ensureUpdateClientBody from '@modules/client/infra/http/middlewares/ensureUpdateClientBody'
import ensureValidFavoriteProductList from '@modules/client/infra/http/middlewares/ensureValidFavoriteProductList'

const clientRouter = Router();

clientRouter.get('/', async (req, res) => {
  const { page } = req.query as any;

  const clients = await Client.paginate({}, {
    page: parseInt(page) || 1,
    limit: 10,
    sort: '-createdAt',
    populate: 'favorite_products'
  });

  return res.status(200).json(clients);
});

clientRouter.get('/:clientCode', ensureExistentClientCode, async (req, res) => {
  const { clientCode } = req.params;

  const client = await Client.findById(clientCode).populate('favorite_products');


  return res.status(200).json(client);
});

clientRouter.post('/', ensureNewClientBody, ensureValidFavoriteProductList, async (req, res) => {

  const newClient = await Client.create(req.body);

  return res.status(200).json({ id: newClient._id });
});

clientRouter.put('/:clientCode', ensureExistentClientCode, ensureUpdateClientBody, ensureValidFavoriteProductList, async (req, res) => {
  const { clientCode } = req.params;

  const updateClient = await Client.findByIdAndUpdate(clientCode, req.body, { new: true });

  return res.status(200).json(updateClient);
});

clientRouter.delete('/:clientCode', ensureExistentClientCode, async (req, res) => {
  const { clientCode } = req.params;

  await Client.findByIdAndDelete(clientCode);

  return res.status(200).send();
});

export default clientRouter;
