import { injectable } from 'tsyringe';
import { Schema } from 'mongoose';
import * as yup from 'yup';

import Client from '@modules/client/infra/mongoose/schemas/Client'
import Service from '@shared/core/Service';

interface IRulesSchemma {
  [key: string]: any
}

interface IYupSchemma {
  isValid(value: any, options?: any): Promise<boolean>;
}

type Response = {
  schema: IYupSchemma
};

@injectable()
class GetYupRulesSchemaForUpdateClient implements Service<Request, Response> {
  execute(): Response {
    const yupRulesSchema: IRulesSchemma = {};

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        yupRulesSchema[field] = field==='email'?
          yup.string().strict(true).email() :
          yup.string().strict(true);
      }
      if(Client.schema.paths[field] instanceof Schema.Types.Array){
        yupRulesSchema[field] = yup.array().of(yup.string().strict(true))
      }
    });


    const schema = Object.keys(yupRulesSchema).length === 0? yup.object() : yup.object().shape(yupRulesSchema);

    return { schema } as Response
  }
}

export default GetYupRulesSchemaForUpdateClient;
