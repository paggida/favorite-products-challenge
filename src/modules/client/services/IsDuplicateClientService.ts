import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';
import Client from '@modules/client/infra/mongoose/schemas/Client'

interface IFiltersObject {
  [key: string]: any
}

interface Request {
  clientObject: {
    email: string
  };
  ownClientCode?: string
}

interface Response {
  isDuplicateClient: boolean;
}

@injectable()
class IsDuplicateClientService implements Service<Request, Response> {
  async execute({ clientObject, ownClientCode }: Request): Promise<Response> {
    const { email } = clientObject;
    const filtersObject: IFiltersObject= {};

    filtersObject['email'] = new RegExp(`^${email}$`, "i");

    if(ownClientCode){
      filtersObject['_id'] = { $ne: ownClientCode };
    }

    const client = await Client.findOne(filtersObject);

    const isDuplicateClient = client? true:false;

    return { isDuplicateClient } as Response;
  }
}

export default IsDuplicateClientService;
