import { Router } from 'express';

import paginateConfig from '@config/paginate'
import Product from '@modules/product/infra/mongoose/schemas/Product'
import ensureExistentProductCode from '@modules/product/infra/http/middlewares/ensureExistentProductCode'
import ensureNewProductBody from '@modules/product/infra/http/middlewares/ensureNewProductBody'
import ensureUpdateProductBody from '@modules/product/infra/http/middlewares/ensureUpdateProductBody'

const productRouter = Router();

productRouter.get('/', async (req, res) => {
  const { page } = req.query as any;

  const product = await Product.paginate({}, {
    page: parseInt(page) || 1,
    limit: paginateConfig.limitByPage,
    sort: paginateConfig.sortField
  });

  return res.status(200).json(product);
});

productRouter.get('/:productCode', ensureExistentProductCode, async (req, res) => {
  const { productCode } = req.params;

  const product = await Product.findById(productCode);

  return res.status(200).json(product);
});

productRouter.post('/', ensureNewProductBody, async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(200).json({ id: newProduct._id });
});

productRouter.put('/:productCode', ensureExistentProductCode, ensureUpdateProductBody, async (req, res) => {
  const { productCode } = req.params;

  const updateProduct = await Product.findByIdAndUpdate(productCode, req.body, { new: true });

  return res.status(200).json(updateProduct);
});

productRouter.delete('/:productCode', ensureExistentProductCode, async (req, res) => {
  const { productCode } = req.params;

  await Product.findByIdAndDelete(productCode);

  return res.status(200).send();
});

export default productRouter;
