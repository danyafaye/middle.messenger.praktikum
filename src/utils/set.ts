import { merge } from '@utils';

type Indexed<T = unknown> = {
  [key in string]: T;
};

export const set = (object: Indexed | unknown, path: string, value: unknown): Indexed | unknown => {
  if (typeof object !== 'object') {
    return object;
  }

  const pathArray = path.split('.');

  const newObject: Indexed | unknown = pathArray.reduceRight<Indexed>(
    (result, item) => {
      return { [item]: result };
    },
    value as unknown as Indexed
  );

  return merge(object as Indexed, newObject as Indexed);
};
