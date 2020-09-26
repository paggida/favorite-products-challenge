import { container } from 'tsyringe';
import { DocumentQuery } from 'mongoose';

import Client, { ClientDocument} from '@modules/client/infra/mongoose/schemas/Client'
import IsClientCodeExistsService from '@modules/client/services/IsClientCodeExistsService';

const isClientCodeExistsService = container.resolve(IsClientCodeExistsService);

describe('Validation of validity and existence of a client code.', () => {
  it('Should not be able to verify an invalid client code.', async () => {
    const { isExistsClientCode } = await isClientCodeExistsService.execute({ clientCode:'123' });

    expect(isExistsClientCode).toBeFalsy();
  });
  it('Should not be able to verify a valid and unknown client code.', async () => {
    const responseClient: unknown = null;
    const spy = jest.spyOn(Client, 'findById').mockReturnValue(responseClient as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isExistsClientCode } = await isClientCodeExistsService.execute({ clientCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isExistsClientCode).toBeFalsy();
  });
  it('Should be able to verify a valid and existing client code.', async () => {
    const spy = jest.spyOn(Client, 'findById').mockReturnValue({} as DocumentQuery<ClientDocument | null, ClientDocument, {}>);

    const { isExistsClientCode } = await isClientCodeExistsService.execute({ clientCode:'551137c2f9e1fac808a5f572' });

    expect(spy).toHaveBeenCalled();
    expect(isExistsClientCode).toBeTruthy();
  });
});
