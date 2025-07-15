import { BlockInstance, BlockProps, StoreState } from '@models';
import { store } from '@store';

export const connect = <T extends BlockProps = {}>(
  mapStateToProps: (state: StoreState) => Partial<T>,
  Component: (props: T) => BlockInstance<T>
) => {
  type OwnProps = Omit<T, keyof ReturnType<typeof mapStateToProps>>;
  return (ownProps: OwnProps) => {
    const stateProps = mapStateToProps(store.getState());
    const allProps = { ...ownProps, ...stateProps } as T;
    const component = Component(allProps);

    const handleStoreUpdate = () => {
      const newStateProps = mapStateToProps(store.getState());
      const updatedProps = { ...ownProps, ...newStateProps } as Partial<T>;
      component.setProps(updatedProps);
    };

    store.subscribe(handleStoreUpdate);

    component.setProps({
      componentWillUnmount: (block: BlockInstance) => {
        store.unsubscribe(handleStoreUpdate);
        const orig = block.getProps().componentWillUnmount;
        if (typeof orig === 'function') orig(block);
      },
    } as Partial<T>);

    return component;
  };
};
