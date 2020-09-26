import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';

interface YupSchema {
  isValid(value: any, options?: any): Promise<boolean>;
}

interface Request {
  clientObject: object;
  yupRulesSchema: YupSchema;
}

interface Response {
  isValidClientObj: boolean;
}

@injectable()
class IsValidClientObjectService implements Service<Request, Response> {
  async execute({ clientObject, yupRulesSchema }: Request): Promise<Response> {

    const isValidClientObj = await yupRulesSchema.isValid(clientObject);

    return { isValidClientObj } as Response;
  }
}

export default IsValidClientObjectService;
