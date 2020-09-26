import * as yup from 'yup';
import { container } from 'tsyringe';

import IsValidProductObjectService from '@modules/product/services/IsValidProductObjectService';

const isValidProductObjectService = container.resolve(IsValidProductObjectService);

describe('Validation of the compatibility check between product object and Yap object.', () => {
  it('Should be able to validate compatibility with an object that has the rules of Yup schema.', async () => {
    const yupRulesSchema = yup.object().shape({
      title: yup.string().strict(true).required(),
      brand: yup.string().strict(true).required(),
      image: yup.string().strict(true),
      price: yup.number().required(),
      review_score: yup.number()
    })

    const productObject = {
      title: 'Product-Test-Jest',
      brand: 'Company-Test-Jest',
      image: 'http://www.images.com/test-jest-img.png',
      price: 99.99,
      review_score: 9.9
    };

    const { isValidProductObj } = await isValidProductObjectService.execute({ productObject, yupRulesSchema  });

    expect(isValidProductObj).toBeTruthy();
  });
  it('Should not be able to validate compatibility with an object that has not the rules of Yup schema.', async () => {
    const yupRulesSchema = yup.object().shape({
      title: yup.string().strict(true).required(),
      brand: yup.string().strict(true).required(),
      image: yup.string().strict(true),
      price: yup.number().required(),
      review_score: yup.number()
    })

    const productObject = {
      image: 9.9,
      review_score: 'http://www.images.com/test-jest-img.png'
    };

    const { isValidProductObj } = await isValidProductObjectService.execute({ productObject, yupRulesSchema  });

    expect(isValidProductObj).toBeFalsy();
  });
});
