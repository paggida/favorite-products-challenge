import { container } from 'tsyringe';
import { Schema } from 'mongoose';

import Client from '@modules/client/infra/mongoose/schemas/Client'
import GetYupRulesSchemaForUpdateClient from '@modules/client/services/GetYupRulesSchemaForUpdateClient';

const getYupRulesSchemaForUpdateClient = container.resolve(GetYupRulesSchemaForUpdateClient);

interface IMockUpdateClient {
  [key: string]: any
}

describe('Validation of the Yup object for validating update clients.', () => {
  it('Should be able to validate a valid Client object with the received Yup schema.', async() => {
    let updateClient:IMockUpdateClient={};

    const { schema } = getYupRulesSchemaForUpdateClient.execute();

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        updateClient[field] = field==='email'? 'client.test@jest.com' : 'Client-Test-Jest';
      }
      if(Client.schema.paths[field] instanceof Schema.Types.Array){
        updateClient[field] = ['5f6f88489e0af500112fe210'];
      }
    });

    const isValidClientObj = await schema.isValid(updateClient);

    expect(isValidClientObj).toBeTruthy();
  });
  it('Should not be able to validate an invalid Client object with the received Yup schema.', async() => {
    let updateClient:IMockUpdateClient={};

    const { schema } = getYupRulesSchemaForUpdateClient.execute();

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        updateClient[field] = field==='email'? 999 : 9;
      }
      if(Client.schema.paths[field] instanceof Schema.Types.Array){
        updateClient[field] = '5f6f88489e0af500112fe210';
      }
    });

    const isValidClientObj = await schema.isValid(updateClient);

    expect(isValidClientObj).toBeFalsy();
  });
});
