import { injectable } from 'tsyringe';
import { ObjectID } from 'mongodb';

import Service from '@shared/core/Service';
import Client from '@modules/client/infra/mongoose/schemas/Client'

interface Request {
  clientCode: string;
}

interface Response {
  isExistsClientCode: boolean;
}

@injectable()
class IsClientCodeExistsService implements Service<Request, Response> {
  async execute({ clientCode }: Request): Promise<Response> {
    let isExistsClientCode = false;

    if(ObjectID.isValid(clientCode)){
      const client = await Client.findById(clientCode);
      isExistsClientCode = client? true:false;
    }

    return { isExistsClientCode } as Response;
  }
}

export default IsClientCodeExistsService;
