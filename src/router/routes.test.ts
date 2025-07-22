import { BlockInstance } from '@models';

import { ROUTE_URLS, routeList, router, ROUTES } from './routes';

const createMockBlockInstance = (content = 'Mock Content'): BlockInstance => ({
  _id: 'mock-id',
  element: null,
  setProps: jest.fn(),
  getProps: jest.fn(() => ({})),
  setLists: jest.fn(),
  getContent: jest.fn(() => {
    const div = document.createElement('div');
    div.textContent = content;
    return div;
  }),
  dispatchComponentDidMount: jest.fn(),
  dispatchComponentWillUnmount: jest.fn(),
  show: jest.fn(),
  hide: jest.fn(),
  _render: jest.fn(),
});

jest.mock('@pages', () => ({
  create404Page: jest.fn(() => createMockBlockInstance('404 Page')),
  create500Page: jest.fn(() => createMockBlockInstance('500 Page')),
  createChatPage: jest.fn(() => createMockBlockInstance('Chat Page')),
  createProfilePage: jest.fn(() => createMockBlockInstance('Profile Page')),
  createSignInPage: jest.fn(() => createMockBlockInstance('SignIn Page')),
  createSignUpPage: jest.fn(() => createMockBlockInstance('SignUp Page')),
}));

jest.mock('@utils', () => ({
  generatePath: jest.fn((path, params) => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value as string);
    });
    return result;
  }),
}));

describe('router', () => {
  let mockPushState: jest.SpyInstance;
  let mockAddEventListener: jest.SpyInstance;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';

    mockPushState = jest.spyOn(window.history, 'pushState').mockImplementation();
    mockAddEventListener = jest.spyOn(window, 'addEventListener').mockImplementation();

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
      },
      writable: true,
    });

    router.clear();

    jest.clearAllMocks();
  });

  afterEach(() => {
    mockPushState.mockRestore();
    mockAddEventListener.mockRestore();
  });

  describe('константы маршрутов', () => {
    it('должен содержать правильные маршруты', () => {
      expect(ROUTES.SIGN_IN).toBe('/');
      expect(ROUTES.SIGN_UP).toBe('/sign-up');
      expect(ROUTES.PAGE_404).toBe('/404');
      expect(ROUTES.PAGE_500).toBe('/500');
      expect(ROUTES.PROFILE).toBe('/settings');
      expect(ROUTES.CHAT).toBe('/messenger');
      expect(ROUTES.CHAT_WITH_ID).toBe('/messenger/:id');
    });

    it('должен генерировать URL с параметрами', () => {
      const chatUrl = ROUTE_URLS.CHAT_WITH_ID('123');
      expect(chatUrl).toBe('/messenger/123');
    });
  });

  describe('список маршрутов', () => {
    it('должен содержать все необходимые маршруты', () => {
      expect(routeList[ROUTES.SIGN_IN]).toBeDefined();
      expect(routeList[ROUTES.SIGN_UP]).toBeDefined();
      expect(routeList[ROUTES.PAGE_404]).toBeDefined();
      expect(routeList[ROUTES.PAGE_500]).toBeDefined();
      expect(routeList[ROUTES.PROFILE]).toBeDefined();
      expect(routeList[ROUTES.CHAT]).toBeDefined();
      expect(routeList[ROUTES.CHAT_WITH_ID]).toBeDefined();
    });

    it('должен вызывать функции создания страниц с параметрами', () => {
      const params = { id: '123' };

      const chatResult = routeList[ROUTES.CHAT](params);
      const chatWithIdResult = routeList[ROUTES.CHAT_WITH_ID](params);

      expect(typeof routeList[ROUTES.CHAT]).toBe('function');
      expect(typeof routeList[ROUTES.CHAT_WITH_ID]).toBe('function');
      expect(chatResult).toBeDefined();
      expect(chatWithIdResult).toBeDefined();
    });
  });

  describe('навигация', () => {
    it('должен перейти на существующий маршрут', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance('Test Page'));
      router.use('/test', mockComponent);

      router.navigate('/test');

      expect(mockPushState).toHaveBeenCalledWith({}, '', '/test');
      expect(mockComponent).toHaveBeenCalledWith({});
    });

    it('должен перейти на 404 при несуществующем маршруте', () => {
      router.navigate('/nonexistent');

      expect(mockPushState).toHaveBeenCalledWith({}, '', '/404');
    });

    it('должен обработать маршрут с параметрами', () => {
      const mockComponent = jest.fn((params) => createMockBlockInstance(`User ${params.id}`));
      router.use('/user/:id', mockComponent);

      router.navigate('/user/123');

      expect(mockPushState).toHaveBeenCalledWith({}, '', '/user/123');
      expect(mockComponent).toHaveBeenCalledWith({ id: '123' });
    });

    it('должен отрендерить компонент в корневой элемент', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance('Test Component'));

      router.use('/test', mockComponent);
      router.navigate('/test');

      const appElement = document.getElementById('app');
      expect(appElement?.textContent).toBe('Test Component');
    });
  });

  describe('извлечение параметров', () => {
    it('должен извлечь параметры из URL', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/chat/:id', mockComponent);
      router.navigate('/chat/456');

      expect(mockComponent).toHaveBeenCalledWith({ id: '456' });
    });

    it('должен вернуть пустой объект если параметров нет', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/profile', mockComponent);
      router.navigate('/profile');

      expect(mockComponent).toHaveBeenCalledWith({});
    });
  });

  describe('сопоставление маршрутов', () => {
    it('должен найти точное совпадение маршрута', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/exact-match', mockComponent);
      router.navigate('/exact-match');

      expect(mockComponent).toHaveBeenCalled();
    });

    it('должен найти маршрут с параметрами', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/item/:id', mockComponent);
      router.navigate('/item/789');

      expect(mockComponent).toHaveBeenCalledWith({ id: '789' });
    });

    it('не должен найти несовпадающий маршрут', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/specific', mockComponent);
      router.navigate('/different');

      expect(mockComponent).not.toHaveBeenCalled();
      expect(mockPushState).toHaveBeenCalledWith({}, '', '/404');
    });
  });

  describe('запуск роутера', () => {
    it('должен добавить обработчик события popstate', () => {
      router.start();

      expect(mockAddEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    it('должен обработать текущий маршрут при запуске', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/current' },
        writable: true,
      });

      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/current', mockComponent);
      router.start();

      expect(mockComponent).toHaveBeenCalled();
    });

    it('должен перейти на 404 если текущий маршрут не найден при запуске', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/unknown' },
        writable: true,
      });

      router.start();

      expect(mockPushState).toHaveBeenCalledWith({}, '', '/404');
    });
  });

  describe('обработка событий браузера', () => {
    it('должен обработать событие popstate', () => {
      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/back', mockComponent);
      router.start();

      Object.defineProperty(window, 'location', {
        value: { pathname: '/back' },
        writable: true,
      });

      const popstateHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'popstate'
      )?.[1];

      if (popstateHandler) {
        popstateHandler();
      }

      expect(mockComponent).toHaveBeenCalled();
    });
  });

  describe('рендеринг компонентов', () => {
    it('должен вызвать dispatchComponentDidMount после рендеринга', () => {
      const mockInstance = createMockBlockInstance();
      const mockComponent = jest.fn(() => mockInstance);

      router.use('/mount-test', mockComponent);
      router.navigate('/mount-test');

      expect(mockInstance.dispatchComponentDidMount).toHaveBeenCalled();
    });

    it('должен заменить содержимое корневого элемента', () => {
      const appElement = document.getElementById('app');
      appElement!.innerHTML = '<div>Old content</div>';

      const mockComponent = jest.fn(() => createMockBlockInstance('New content'));

      router.use('/replace-test', mockComponent);
      router.navigate('/replace-test');

      expect(appElement?.textContent).toBe('New content');
    });

    it('должен обработать отсутствие корневого элемента', () => {
      document.getElementById('app')?.remove();

      const mockComponent = jest.fn(() => createMockBlockInstance());

      router.use('/no-root', mockComponent);

      expect(() => router.navigate('/no-root')).not.toThrow();
    });
  });
});
