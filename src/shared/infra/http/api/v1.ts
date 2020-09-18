import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.v1.json';
import sessionRouter from '@modules/session/infra/http/routes/sessionRouter';
import clientRouter from '@modules/client/infra/http/routes/clientRouter';
import productRouter from '@modules/product/infra/http/routes/productRouter';

const v1Router = Router();

v1Router.use('/v1/session', sessionRouter);
v1Router.use('/v1/client', clientRouter);
v1Router.use('/v1/product', productRouter);
v1Router.use('/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default v1Router;
