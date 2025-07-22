import { createBlock } from './Block';

jest.mock('handlebars', () => ({
  compile: jest.fn((template) => (data: any) => {
    let result = template;
    if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
      });
    }
    return result;
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

jest.mock('@utils', () => ({
  getChildrenPropsAndProps: jest.fn((props) => ({
    children: props.children || {},
    props: { ...props, children: undefined, lists: undefined },
    lists: props.lists || {},
  })),
  makePropsProxy: jest.fn((props, callback) => {
    return new Proxy(props, {
      set(target, prop, value) {
        const oldProps = { ...target };
        target[prop] = value;
        callback(oldProps, target);
        return true;
      },
    });
  }),
}));

describe('createBlock', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('создание блока', () => {
    it('должен создать блок с базовыми свойствами', () => {
      const block = createBlock({
        render: () => '<div>Test Block</div>',
      });

      expect(block._id).toBe('test-uuid-123');
      expect(typeof block.setProps).toBe('function');
      expect(typeof block.getContent).toBe('function');
      expect(typeof block.dispatchComponentDidMount).toBe('function');
    });

    it('должен создать блок с пустыми пропсами', () => {
      const block = createBlock();

      expect(block._id).toBe('test-uuid-123');
      expect(typeof block.setProps).toBe('function');
    });

    it('должен создать блок с дочерними элементами', () => {
      const childBlock = createBlock({
        render: () => '<span>Child</span>',
      });

      const parentBlock = createBlock({
        render: () => '<div>{{child}}</div>',
        children: {
          child: childBlock,
        },
      });

      expect(parentBlock._id).toBe('test-uuid-123');
    });
  });

  describe('методы жизненного цикла', () => {
    it('должен вызвать componentDidMount при монтировании', () => {
      const componentDidMount = jest.fn();
      const block = createBlock({
        render: () => '<div>Test</div>',
        componentDidMount,
      });

      block.dispatchComponentDidMount();

      expect(componentDidMount).toHaveBeenCalledWith(block);
    });

    it('должен вызвать componentDidUpdate при обновлении пропсов', () => {
      const componentDidUpdate = jest.fn(() => true);
      const block = createBlock({
        render: () => '<div>{{text}}</div>',
        componentDidUpdate,
        text: 'initial',
      });

      block.setProps({ text: 'updated' });

      expect(componentDidUpdate).toHaveBeenCalled();
    });

    it('должен вызвать componentWillUnmount при размонтировании', () => {
      const componentWillUnmount = jest.fn();
      const block = createBlock({
        render: () => '<div>Test</div>',
        componentWillUnmount,
      });

      block.dispatchComponentWillUnmount();

      expect(componentWillUnmount).toHaveBeenCalledWith(block);
    });

    it('должен вызвать afterRender после рендеринга', () => {
      const afterRender = jest.fn();
      const block = createBlock({
        render: () => '<div>Test</div>',
        afterRender,
      });

      expect(afterRender).toHaveBeenCalledWith(block);
    });
  });

  describe('рендеринг', () => {
    it('должен отрендерить простой шаблон', () => {
      const block = createBlock({
        render: () => '<div class="test">{{text}}</div>',
        text: 'Hello World',
      });

      const element = block.getContent();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test');
      expect(element.textContent).toBe('Hello World');
    });

    it('должен обновить DOM при изменении пропсов', () => {
      const block = createBlock({
        render: () => '<div>{{text}}</div>',
        text: 'initial',
      });

      const initialElement = block.getContent();
      expect(initialElement.textContent).toBe('initial');

      block.setProps({ text: 'updated' });

      const updatedElement = block.getContent();
      expect(updatedElement.textContent).toBe('updated');
    });

    it('должен установить атрибуты элемента', () => {
      const block = createBlock({
        render: () => '<div>Test</div>',
        attr: {
          'data-test': 'value',
          id: 'test-id',
        },
      });

      const element = block.getContent();
      expect(element.getAttribute('data-test')).toBe('value');
      expect(element.getAttribute('id')).toBe('test-id');
    });
  });

  describe('события', () => {
    it('должен добавить обработчики событий', () => {
      const clickHandler = jest.fn();
      const block = createBlock({
        render: () => '<button>Click me</button>',
        events: {
          click: clickHandler,
        },
      });

      const element = block.getContent();
      const event = new Event('click');
      element.dispatchEvent(event);

      expect(clickHandler).toHaveBeenCalledWith(event);
    });

    it('должен добавить обработчики событий с селектором', () => {
      const clickHandler = jest.fn();
      const block = createBlock({
        render: () => '<div><button class="btn">Click</button></div>',
        events: {
          click: {
            selector: '.btn',
            handler: clickHandler,
          },
        },
      });

      const element = block.getContent();
      const button = element.querySelector('.btn') as HTMLElement;
      const event = new Event('click');
      button.dispatchEvent(event);

      expect(clickHandler).toHaveBeenCalledWith(event);
    });
  });

  describe('методы управления', () => {
    it('должен показать элемент', () => {
      const block = createBlock({
        render: () => '<div>Test</div>',
      });

      const element = block.getContent();
      element.style.display = 'none';

      block.show();

      expect(element.style.display).toBe('block');
    });

    it('должен скрыть элемент', () => {
      const block = createBlock({
        render: () => '<div>Test</div>',
      });

      const element = block.getContent();
      element.style.display = 'block';

      block.hide();

      expect(element.style.display).toBe('none');
    });

    it('должен вернуть пропсы через getProps', () => {
      const initialProps = {
        render: () => '<div>Test</div>',
        text: 'test',
        value: 123,
      };

      const block = createBlock(initialProps);
      const props = block.getProps();

      expect(props.text).toBe('test');
      expect(props.value).toBe(123);
    });

    it('должен обновить списки через setLists', () => {
      const block = createBlock({
        render: () => '<div>{{items}}</div>',
      });

      const items = ['item1', 'item2', 'item3'];
      block.setLists({ items });

      expect(() => block.setLists({ items })).not.toThrow();
    });
  });

  describe('обработка ошибок', () => {
    it('должен выбросить ошибку при попытке получить несуществующий элемент', () => {
      const block = createBlock({
        render: () => '',
      });

      (block as any)._element = null;

      expect(() => block.getContent()).toThrow('Элемент не создан');
    });

    it('должен обработать ошибку рендеринга', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      createBlock({
        render: () => {
          throw new Error('Template error');
        },
      });

      expect(consoleSpy).toHaveBeenCalledWith('Ошибка в _render:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('работа с дочерними элементами', () => {
    it('должен корректно обработать дочерние блоки', () => {
      const childBlock = createBlock({
        render: () => '<span>Child Content</span>',
      });

      const parentBlock = createBlock({
        render: () => '<div>{{child}}</div>',
        children: {
          child: childBlock,
        },
      });

      const element = parentBlock.getContent();
      expect(element.querySelector('span')).toBeTruthy();
    });

    it('должен вызвать componentDidMount для дочерних элементов', () => {
      const childDidMount = jest.fn();
      const childBlock = createBlock({
        render: () => '<span>Child</span>',
        componentDidMount: childDidMount,
      });

      const parentBlock = createBlock({
        render: () => '<div>{{child}}</div>',
        children: {
          child: childBlock,
        },
      });

      parentBlock.dispatchComponentDidMount();

      expect(childDidMount).toHaveBeenCalled();
    });
  });
});
