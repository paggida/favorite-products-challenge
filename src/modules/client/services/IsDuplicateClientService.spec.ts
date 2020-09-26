import { container } from 'tsyringe';
import { DocumentQuery } from 'mongoose';

import Client, { ClientDocument} from '@modules/client/infra/mongoose/schemas/Client'
import IsDuplicateClientService from '@modules/client/services/IsDuplicateClientService';

const isDuplicateClientService = container.resolve(IsDuplicateClientService);
const clientObject = {
  name: 'Client-Test-Jest',
  email: 'client.test@jest.com',
  favorite_products: []
};

describe('Validation of duplicate clients.', () => {
  it('Should not be able to validate a client update that will generate the same records with different ids', async () => {
    const spy = jest.spyOn(Client, 'findOne').mockReturnValue({} as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isDuplicateClient } = await isDuplicateClientService.execute({ clientObject, ownClientCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateClient).toBeTruthy();
  });
  it('Should be able to validate a client update that is new to the database.', async () => {
    const responseClient: unknown = null;
    const spy = jest.spyOn(Client, 'findOne').mockReturnValue(responseClient as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isDuplicateClient } = await isDuplicateClientService.execute({ clientObject, ownClientCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateClient).toBeFalsy();
  });
  it('Should not be able to validate a client that is not new in the database.', async () => {
    const spy = jest.spyOn(Client, 'findOne').mockReturnValue({} as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isDuplicateClient } = await isDuplicateClientService.execute({ clientObject });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateClient).toBeTruthy();
  });
  it('Should be able to validate that a new client is new in the database.', async () => {
    const responseClient: unknown = null;
    const spy = jest.spyOn(Client, 'findOne').mockReturnValue(responseClient as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isDuplicateClient } = await isDuplicateClientService.execute({ clientObject });

    expect(spy).toHaveBeenCalled();
    expect(isDuplicateClient).toBeFalsy();
  });
});
