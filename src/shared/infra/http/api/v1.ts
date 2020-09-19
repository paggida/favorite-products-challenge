import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.v1.json';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import sessionRouter from '@modules/session/infra/http/routes/sessionRouter';
import clientRouter from '@modules/client/infra/http/routes/clientRouter';
import productRouter from '@modules/product/infra/http/routes/productRouter';

const v1Router = Router();

v1Router.use('/v1/session', sessionRouter);
v1Router.use('/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

v1Router.use(ensureAuthenticated);

v1Router.use('/v1/client', clientRouter);
v1Router.use('/v1/product', productRouter);

export default v1Router;
