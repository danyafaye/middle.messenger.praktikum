import { isArray } from '@utils';

export const isEmpty = (array: unknown) => {
  return !array || (isArray(array) && array.length === 0);
};
