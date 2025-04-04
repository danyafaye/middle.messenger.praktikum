import { BlockInstance, BlockProps } from '@models';

export const getChildrenPropsAndProps = <T extends BlockProps>(
  propsAndChildren: T
): {
  children: Record<string, BlockInstance>;
  props: BlockProps;
  lists: Record<string, unknown[]>;
} => {
  const children: Record<string, BlockInstance> = {};
  const props: BlockProps = {};
  const lists: Record<string, unknown[]> = {};

  Object.entries(propsAndChildren).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      'getContent' in value &&
      typeof (value as { getContent: () => HTMLElement }).getContent === 'function' &&
      '_id' in (value as object)
    ) {
      children[key] = value as BlockInstance;
    } else if (Array.isArray(value)) {
      lists[key] = value;
    } else {
      props[key] = value;
    }
  });
  return { children, props, lists };
};
