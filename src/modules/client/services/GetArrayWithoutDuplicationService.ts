import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';

interface Request {
  array: any[];
}

interface Response {
  arrayWithoutDUplication: any[];
}

@injectable()
class GetArrayWithoutDuplicationService implements Service<Request, Response> {
  execute({ array }: Request): Response {

    const arrayWithoutDUplication = [...new Set(array)];

    return { arrayWithoutDUplication } as Response;
  }
}

export default GetArrayWithoutDuplicationService;
