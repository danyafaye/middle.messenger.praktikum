import { METHODS } from '@models';

import { createHTTPTransport } from './baseFetch';

jest.mock('@utils', () => ({
  queryStringify: jest.fn((obj) => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }),
}));

describe('createHTTPTransport', () => {
  let httpTransport: ReturnType<typeof createHTTPTransport>;
  let xhrMock: any;

  beforeEach(() => {
    xhrMock = new (global as any).XMLHttpRequest();
    xhrMock._triggerEvent = 'load';
    jest.clearAllMocks();

    jest.spyOn(global as any, 'XMLHttpRequest').mockImplementation(() => xhrMock);

    httpTransport = createHTTPTransport();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('базовый метод request', () => {
    it('должен создать XMLHttpRequest и настроить его', async () => {
      const url = 'https://example.com/api';
      const options = { method: METHODS.GET };

      xhrMock.status = 200;
      xhrMock.responseText = '{"success": true}';

      const requestPromise = httpTransport.request(url, options);

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      const response = await requestPromise;
      expect(response).toBe(xhrMock);
      expect(xhrMock.open).toHaveBeenCalledWith(METHODS.GET, url);
      expect(xhrMock.timeout).toBe(5000);
      expect(xhrMock.withCredentials).toBe(true);
    });

    it('должен установить заголовки', async () => {
      const url = 'https://example.com/api';
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer token' };
      const options = { method: METHODS.POST, headers };

      xhrMock.status = 200;

      const requestPromise = httpTransport.request(url, options);

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer token');
    });

    it('должен отклонить промис при статусе >= 400', async () => {
      const url = 'https://example.com/api';
      const options = { method: METHODS.GET };

      xhrMock.status = 404;

      const requestPromise = httpTransport.request(url, options);

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await expect(requestPromise).rejects.toBe(xhrMock);
    });

    it('должен обработать ошибку запроса', async () => {
      const url = 'https://example.com/api';
      const options = { method: METHODS.GET };

      xhrMock._triggerEvent = 'error';

      const requestPromise = httpTransport.request(url, options);

      await expect(requestPromise).rejects.toThrow('Request error');
    });

    it('должен обработать отмену запроса', async () => {
      const url = 'https://example.com/api';
      const options = { method: METHODS.GET };

      xhrMock._triggerEvent = 'abort';

      const requestPromise = httpTransport.request(url, options);

      await expect(requestPromise).rejects.toThrow('Request aborted');
    });

    it('должен обработать таймаут', async () => {
      const url = 'https://example.com/api';
      const options = { method: METHODS.GET };

      xhrMock._triggerEvent = 'timeout';

      const requestPromise = httpTransport.request(url, options, 1000);

      await expect(requestPromise).rejects.toThrow('Request timeout');
      expect(xhrMock.timeout).toBe(1000);
    });
  });

  describe('метод GET', () => {
    it('должен добавить параметры в URL для GET запроса', async () => {
      const url = 'https://example.com/api';
      const data = { param1: 'value1', param2: 'value2' } as any;

      xhrMock.status = 200;

      const requestPromise = httpTransport.get(url, { data });

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.open).toHaveBeenCalledWith(
        METHODS.GET,
        'https://example.com/api?param1=value1&param2=value2'
      );
    });

    it('должен отправить GET запрос без данных', async () => {
      const url = 'https://example.com/api';

      xhrMock.status = 200;

      const requestPromise = httpTransport.get(url);

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.open).toHaveBeenCalledWith(METHODS.GET, url);
      expect(xhrMock.send).toHaveBeenCalledWith();
    });
  });

  describe('метод POST', () => {
    it('должен отправить POST запрос с данными', async () => {
      const url = 'https://example.com/api';
      const data = JSON.stringify({ name: 'test' });

      xhrMock.status = 200;

      const requestPromise = httpTransport.post(url, { data });

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.open).toHaveBeenCalledWith(METHODS.POST, url);
      expect(xhrMock.send).toHaveBeenCalledWith(data);
    });

    it('должен отправить POST запрос без данных', async () => {
      const url = 'https://example.com/api';

      xhrMock.status = 200;

      const requestPromise = httpTransport.post(url);

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.send).toHaveBeenCalledWith();
    });
  });

  describe('метод PUT', () => {
    it('должен отправить PUT запрос с данными', async () => {
      const url = 'https://example.com/api';
      const data = JSON.stringify({ id: 1, name: 'updated' });

      xhrMock.status = 200;

      const requestPromise = httpTransport.put(url, { data });

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.open).toHaveBeenCalledWith(METHODS.PUT, url);
      expect(xhrMock.send).toHaveBeenCalledWith(data);
    });
  });

  describe('метод DELETE', () => {
    it('должен отправить DELETE запрос с данными', async () => {
      const url = 'https://example.com/api';
      const data = JSON.stringify({ id: 1 });

      xhrMock.status = 200;

      const requestPromise = httpTransport.delete(url, { data });

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.open).toHaveBeenCalledWith(METHODS.DELETE, url);
      expect(xhrMock.send).toHaveBeenCalledWith(data);
    });
  });

  describe('обработка различных типов данных', () => {
    it('должен корректно обработать пустые данные', async () => {
      const url = 'https://example.com/api';

      xhrMock.status = 200;

      const requestPromise = httpTransport.post(url, {});

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.send).toHaveBeenCalledWith();
    });

    it('должен использовать кастомный таймаут', async () => {
      const url = 'https://example.com/api';
      const customTimeout = 10000;

      xhrMock.status = 200;

      const requestPromise = httpTransport.get(url, { timeout: customTimeout });

      setTimeout(() => {
        if (xhrMock.onload) {
          xhrMock.onload();
        }
      }, 0);

      await requestPromise;

      expect(xhrMock.timeout).toBe(customTimeout);
    });
  });
});
