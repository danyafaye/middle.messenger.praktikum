//framework types
export enum BLOCK_EVENTS {
  INIT = 'init',
  COMPONENT_DID_MOUNT = 'flow:component-did-mount',
  COMPONENT_DID_UPDATE = 'flow:component-did-update',
  RENDER = 'flow:render',
}

export type BlockProps = Record<string, unknown> & {
  afterRender?: (instance: BlockInstance) => void;
  componentDidMount?: (instance: BlockInstance) => void;
  componentDidUpdate?: (oldProps: BlockProps, newProps: BlockProps) => void;
};

export type BlockEvents = {
  [BLOCK_EVENTS.INIT]: [];
  [BLOCK_EVENTS.COMPONENT_DID_MOUNT]: [];
  [BLOCK_EVENTS.COMPONENT_DID_UPDATE]: [oldProps: BlockProps, newProps: BlockProps];
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
  show: () => void;
  hide: () => void;
  _render: () => void;
};

export type BlockEventHandler = EventListener | { selector: string; handler: EventListener };
