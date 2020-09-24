import { injectable } from 'tsyringe';

import Service from '@shared/core/Service';

interface YupSchema {
  isValid(value: any, options?: any): Promise<boolean>;
}

interface Request {
  productObject: object;
  yupRulesSchema: YupSchema;
}

interface Response {
  isValidProductObj: boolean;
}

@injectable()
class IsValidProductObjectService implements Service<Request, Response> {
  async execute({ productObject, yupRulesSchema }: Request): Promise<Response> {

    const isValidProductObj = await yupRulesSchema.isValid(productObject);

    return { isValidProductObj } as Response;
  }
}

export default IsValidProductObjectService;
