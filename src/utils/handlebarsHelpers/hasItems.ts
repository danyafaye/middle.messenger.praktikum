import { isArray } from '@utils';

export const hasItems = (array: unknown) => {
  return isArray(array) && array.length > 0;
};
