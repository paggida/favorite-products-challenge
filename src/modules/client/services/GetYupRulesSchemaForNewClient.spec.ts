import { container } from 'tsyringe';
import { Schema } from 'mongoose';

import Client from '@modules/client/infra/mongoose/schemas/Client'
import GetYupRulesSchemaForNewClient from '@modules/client/services/GetYupRulesSchemaForNewClient';

const getYupRulesSchemaForNewClient = container.resolve(GetYupRulesSchemaForNewClient);

interface IMockNewClient {
  [key: string]: any
}

describe('Validation of the Yup object for validating new clients.', () => {
  it('Should be able to validate a valid Client object with the received Yup schema.', async() => {
    let newClient:IMockNewClient={};

    const { schema } = getYupRulesSchemaForNewClient.execute();

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        newClient[field] = field==='email'? 'client.test@jest.com' : 'Client-Test-Jest';
      }

      if(Client.schema.paths[field] instanceof Schema.Types.DocumentArray){
        newClient[field] = ['5f6f88489e0af500112fe210'];
      }
    });

    const isValidClientObj = await schema.isValid(newClient);

    expect(isValidClientObj).toBeTruthy();
  });
  it('Should not be able to validate a Client object without the required fields using the received Yup schema.', async() => {
    const requiredFields = Client.schema.requiredPaths();
    let newClient:IMockNewClient={};

    const { schema } = getYupRulesSchemaForNewClient.execute();

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        if(requiredFields.indexOf(field)<0){
          newClient[field] = field==='email'? 'client.test@jest.com' : 'Client-Test-Jest';
        }
      }

      if(Client.schema.paths[field] instanceof Schema.Types.DocumentArray){
        newClient[field] = ['5f6f88489e0af500112fe210'];
      }
    });

    const isValidClientObj = await schema.isValid(newClient);

    expect(isValidClientObj).toBeFalsy();
  });
  it('Should not be able to validate a Client object without the correct fields type using the received Yup schema.', async() => {
    let newClient:IMockNewClient={};

    const { schema } = getYupRulesSchemaForNewClient.execute();

    Client.schema.eachPath(field => {
      if(Client.schema.paths[field] instanceof Schema.Types.String){
        newClient[field] = field==='email'? 999 : 9;
      }

      if(Client.schema.paths[field] instanceof Schema.Types.DocumentArray){
        newClient[field] = '5f6f88489e0af500112fe210';
      }
    });

    const isValidClientObj = await schema.isValid(newClient);

    expect(isValidClientObj).toBeFalsy();
  });
});
