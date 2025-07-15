import { Indexed } from '@models';

export const merge = (lhs: Indexed, rhs: Indexed): Indexed => {
  const result: Indexed = {};

  const keys = new Set([...Object.keys(lhs), ...Object.keys(rhs)]);

  for (const key of keys) {
    const lVal = lhs[key];
    const rVal = rhs[key];

    if (
      lVal &&
      rVal &&
      typeof lVal === 'object' &&
      typeof rVal === 'object' &&
      !Array.isArray(lVal) &&
      !Array.isArray(rVal)
    ) {
      result[key] = merge(lVal as Indexed, rVal as Indexed);
    } else if (key in rhs) {
      result[key] = rVal;
    } else {
      result[key] = lVal;
    }
  }
  return result;
};
