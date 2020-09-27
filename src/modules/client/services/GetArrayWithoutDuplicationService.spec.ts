import { container } from 'tsyringe';

import GetArrayWithoutDuplicationService from '@modules/client/services/GetArrayWithoutDuplicationService';

const getArrayWithoutDuplicationService = container.resolve(GetArrayWithoutDuplicationService);

describe('Validation of duplicate data within the array.', () => {
  it('Should be able to remove duplicate items within an array.', () => {

  const duplicateArray= [1,1,'1','1','jest','jest'];

    const { arrayWithoutDUplication } = getArrayWithoutDuplicationService.execute({ array: duplicateArray });

    expect(duplicateArray).toEqual(expect.arrayContaining(arrayWithoutDUplication));
    expect(arrayWithoutDUplication).toHaveLength(3);
    expect(arrayWithoutDUplication.indexOf(1)).toBeGreaterThanOrEqual(0);
    expect(arrayWithoutDUplication.indexOf('1')).toBeGreaterThanOrEqual(0);
    expect(arrayWithoutDUplication.indexOf('jest')).toBeGreaterThanOrEqual(0);
  });
});
