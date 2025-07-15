export enum BLOCK_EVENTS {
  INIT = 'init',
  COMPONENT_DID_MOUNT = 'flow:component-did-mount',
  COMPONENT_DID_UPDATE = 'flow:component-did-update',
  RENDER = 'flow:render',
  COMPONENT_WILL_UNMOUNT = 'flow:component-will-unmount',
}

export type BlockProps = Record<string, unknown> & {
  afterRender?: (instance: BlockInstance) => void;
  componentDidMount?: (instance: BlockInstance) => void;
  componentDidUpdate?: (oldProps: BlockProps, newProps: BlockProps) => void;
  componentWillUnmount?: (instance: BlockInstance) => void;
};

export type BlockEvents = {
  [BLOCK_EVENTS.INIT]: [];
  [BLOCK_EVENTS.COMPONENT_DID_MOUNT]: [];
  [BLOCK_EVENTS.COMPONENT_DID_UPDATE]: [oldProps: BlockProps, newProps: BlockProps];
  [BLOCK_EVENTS.COMPONENT_WILL_UNMOUNT]: [];
  [BLOCK_EVENTS.RENDER]: [];
};

export type BlockInstance<T extends BlockProps = {}> = {
  _id: string;
  readonly element: HTMLElement | null;
  setProps: (nextProps: Partial<T>) => void;
  getProps: () => BlockProps;
  setLists: (nextLists: Record<string, unknown[]>) => void;
  getContent: () => HTMLElement;
  dispatchComponentDidMount: () => void;
  dispatchComponentWillUnmount: () => void;
  show: () => void;
  hide: () => void;
  _render: () => void;
};

export type ModalInstance<T extends BlockProps = {}> = BlockInstance<T> & {
  showModal: () => void;
  closeModal: () => void;
};

export type BlockEventHandler = EventListener | { selector: string; handler: EventListener };
