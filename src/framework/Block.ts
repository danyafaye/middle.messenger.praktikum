import Handlebars from 'handlebars';
import { createEventBus } from './EventBus';
import { getChildrenPropsAndProps, makePropsProxy } from '@utils';
import { BLOCK_EVENTS, BlockEventHandler, BlockEvents, BlockInstance, BlockProps } from '@models';
import { v4 as makeUUID } from 'uuid';

export const createBlock = <T extends BlockProps = {}>(
  propsWithChildren: T = {} as T
): BlockInstance<T> => {
  const eventBus = createEventBus<BlockEvents>();
  const _id = makeUUID();

  let _element: HTMLElement | null = null;
  let instance: BlockInstance<T>;

  const { children, props, lists } = getChildrenPropsAndProps(propsWithChildren);

  const _props = makePropsProxy({ ...props } as BlockProps, (oldProps, newProps) =>
    eventBus.emit(BLOCK_EVENTS.COMPONENT_DID_UPDATE, oldProps, newProps)
  );
  const _lists = makePropsProxy({ ...lists }, (oldProps, newProps) =>
    eventBus.emit(BLOCK_EVENTS.COMPONENT_DID_UPDATE, oldProps, newProps)
  );

  const render = (_props.render as () => string) || (() => '');

  const _addEvents = (): void => {
    const events = _props.events as Record<string, BlockEventHandler> | undefined;
    if (_element && events) {
      Object.entries(events).forEach(([eventName, handlerOrObj]) => {
        if (typeof handlerOrObj === 'function') {
          _element!.addEventListener(eventName, handlerOrObj);
        } else if (
          typeof handlerOrObj === 'object' &&
          handlerOrObj.selector &&
          typeof handlerOrObj.handler === 'function'
        ) {
          const childEls = _element!.querySelectorAll(handlerOrObj.selector);
          childEls.forEach((childEl) => {
            childEl.addEventListener(eventName, handlerOrObj.handler);
          });
        }
      });
    }
  };

  const _removeEvents = (): void => {
    const events = _props.events as Record<string, BlockEventHandler> | undefined;
    if (_element && events) {
      Object.entries(events).forEach(([eventName, handlerOrObj]) => {
        if (typeof handlerOrObj === 'function') {
          _element!.removeEventListener(eventName, handlerOrObj);
        } else if (
          typeof handlerOrObj === 'object' &&
          handlerOrObj.selector &&
          typeof handlerOrObj.handler === 'function'
        ) {
          const childEls = _element!.querySelectorAll(handlerOrObj.selector);
          childEls.forEach((childEl) => {
            childEl.removeEventListener(eventName, handlerOrObj.handler);
          });
        }
      });
    }
  };

  const addAttributes = (): void => {
    const attr = _props.attr as Record<string, string> | undefined;
    if (_element && attr) {
      Object.entries(attr).forEach(([key, value]) => {
        _element!.setAttribute(key, value);
      });
    }
  };

  const setProps = (nextProps: Partial<T>): void => {
    if (!nextProps) return;
    Object.assign(_props, nextProps);
  };

  const setLists = (nextLists: Record<string, unknown[]>): void => {
    if (!nextLists) return;
    Object.assign(_lists, nextLists);
  };

  const getContent = (): HTMLElement => {
    if (!_element) throw new Error('Элемент не создан');
    return _element;
  };

  const _createDocumentElement = (tagName: string): HTMLTemplateElement =>
    document.createElement(tagName) as HTMLTemplateElement;

  const _render = (): void => {
    if (_element) {
      _removeEvents();
    }

    const propsAndStubs = { ..._props };
    const tmpId = makeUUID();

    Object.entries(children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });
    Object.entries(_lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
    });

    const fragment = _createDocumentElement('template');
    fragment.innerHTML = Handlebars.compile(render())(propsAndStubs);

    Object.values(children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(_lists).forEach(([, listItems]) => {
      const listCont = _createDocumentElement('template');
      listItems.forEach((item) => {
        if (item && typeof (item as BlockInstance).getContent === 'function') {
          listCont.content.append((item as BlockInstance).getContent());
        } else {
          listCont.content.append(document.createTextNode(String(item)));
        }
      });
      const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
      if (stub) {
        stub.replaceWith(listCont.content);
      }
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;
    if (_element && newElement) {
      _element.replaceWith(newElement);
    }
    _element = newElement;

    _addEvents();
    addAttributes();

    if (typeof _props.afterRender === 'function') {
      _props.afterRender(instance);
    }
  };

  const _componentDidMount = (): void => {
    Object.values(children).forEach((child) => child.dispatchComponentDidMount());
  };

  const _componentDidUpdate = (oldProps: BlockProps, newProps: BlockProps): void => {
    const response =
      typeof _props.componentDidUpdate === 'function'
        ? _props.componentDidUpdate(oldProps, newProps)
        : true;
    if (!response) return;
    _render();
  };

  const init = (): void => {
    eventBus.emit(BLOCK_EVENTS.RENDER);
  };

  const getProps = () => _props;

  eventBus.on(BLOCK_EVENTS.INIT, init);
  eventBus.on(BLOCK_EVENTS.COMPONENT_DID_MOUNT, _componentDidMount);
  eventBus.on(BLOCK_EVENTS.COMPONENT_DID_UPDATE, _componentDidUpdate);
  eventBus.on(BLOCK_EVENTS.RENDER, _render);

  instance = {
    _id,
    get element() {
      return _element;
    },
    setProps,
    getProps,
    setLists,
    getContent,
    dispatchComponentDidMount: () => {
      eventBus.emit(BLOCK_EVENTS.COMPONENT_DID_MOUNT);
    },
    show: () => {
      const content = getContent();
      if (content) content.style.display = 'block';
    },
    hide: () => {
      const content = getContent();
      if (content) content.style.display = 'none';
    },
    _render,
  };

  eventBus.emit(BLOCK_EVENTS.INIT);

  return instance;
};
