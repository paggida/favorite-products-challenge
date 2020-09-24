import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';

interface Request {
  productObject: {
    _id: any,
    createdAt: any,
    updatedAt: any,
    __v: any
  };
}

interface Response {
  cleanProductObject: object;
}

@injectable()
class GetCleanProductObjectService implements Service<Request, Response> {
   execute({ productObject }: Request): Response {

    delete productObject._id;
    delete productObject.createdAt;
    delete productObject.updatedAt;
    delete productObject.__v;

    return { cleanProductObject: productObject } as Response;
  }
}

export default GetCleanProductObjectService;
