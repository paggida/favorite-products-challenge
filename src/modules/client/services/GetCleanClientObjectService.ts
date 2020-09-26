import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';

interface Request {
  clientObject: {
    _id: any,
    createdAt: any,
    updatedAt: any,
    __v: any
  };
}

interface Response {
  cleanClientObject: object;
}

@injectable()
class GetCleanClientObjectService implements Service<Request, Response> {
   execute({ clientObject }: Request): Response {

    delete clientObject._id;
    delete clientObject.createdAt;
    delete clientObject.updatedAt;
    delete clientObject.__v;

    return { cleanClientObject: clientObject } as Response;
  }
}

export default GetCleanClientObjectService;
