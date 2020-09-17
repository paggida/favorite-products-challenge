import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.v1.json';
import clientRouter from '@modules/client/infra/http/routes/client';

const v1Router = Router();

v1Router.use('/v1/client', clientRouter);
v1Router.use('/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default v1Router;
