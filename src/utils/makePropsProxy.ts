import { BlockProps } from '@models';

export const makePropsProxy = <T extends BlockProps>(
  propsObj: T,
  emit: (oldProps: T, newProps: T) => void
): T =>
  new Proxy(propsObj, {
    get: (target, prop: string) => {
      const value = target[prop as keyof T];
      return typeof value === 'function' ? value.bind(target) : value;
    },
    set: (target, prop: string, value: unknown) => {
      const oldTarget = { ...target };
      target[prop as keyof T] = value as T[keyof T];
      emit(oldTarget, target);
      return true;
    },
    deleteProperty: () => {
      throw new Error('Нет доступа');
    },
  });
