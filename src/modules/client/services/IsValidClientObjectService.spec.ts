import * as yup from 'yup';
import { container } from 'tsyringe';

import IsValidClientObjectService from '@modules/client/services/IsValidClientObjectService';

const isValidClientObjectService = container.resolve(IsValidClientObjectService);

describe('Validation of the compatibility check between client object and Yap object.', () => {
  it('Should be able to validate compatibility with an object that has the rules of Yup schema.', async () => {
    const yupRulesSchema = yup.object().shape({
      name: yup.string().strict(true).required(),
      email: yup.string().strict(true).email(),
      favorite_products: yup.array().of(yup.string().strict(true)),
    })

    const clientObject = {
      name: 'Client-Test-Jest',
      email: 'client.test@jest.com',
      favorite_products: ['5f6f88489e0af500112fe210']
    };

    const { isValidClientObj } = await isValidClientObjectService.execute({ clientObject, yupRulesSchema  });

    expect(isValidClientObj).toBeTruthy();
  });
  it('Should not be able to validate compatibility with an object that has not the rules of Yup schema.', async () => {
    const yupRulesSchema = yup.object().shape({
      name: yup.string().strict(true).required(),
      email: yup.string().strict(true).email(),
      favorite_products: yup.array().of(yup.string().strict(true)),
    })

    const clientObject = {
      name: 123,
      email: 'client.test@jest..com',
      favorite_products: [123]
    };

    const { isValidClientObj } = await isValidClientObjectService.execute({ clientObject, yupRulesSchema  });

    expect(isValidClientObj).toBeFalsy();
  });
});
