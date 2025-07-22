import 'jest-environment-jsdom';

class MockXMLHttpRequest {
  public status = 200;
  public responseText = '';
  public readyState = 4;
  public withCredentials = false;
  public timeout = 0;
  public _triggerEvent = 'load';

  public static readonly UNSENT = 0;
  public static readonly OPENED = 1;
  public static readonly HEADERS_RECEIVED = 2;
  public static readonly LOADING = 3;
  public static readonly DONE = 4;

  public readonly UNSENT = 0;
  public readonly OPENED = 1;
  public readonly HEADERS_RECEIVED = 2;
  public readonly LOADING = 3;
  public readonly DONE = 4;

  private _headers: Record<string, string> = {};
  private _listeners: Record<string, Function> = {};

  open = jest.fn((): void => {});

  setRequestHeader = jest.fn((name: string, value: string): void => {
    this._headers[name] = value;
  });

  send = jest.fn((_data?: unknown): void => {
    setTimeout(() => {
      if (this._listeners[this._triggerEvent]) {
        this._listeners[this._triggerEvent]();
      }
    }, 0);
  });

  addEventListener(event: string, handler: Function): void {
    this._listeners[event] = handler;
  }

  removeEventListener(event: string, _handler: Function): void {
    delete this._listeners[event];
  }

  set onload(handler: Function) {
    this._listeners.load = handler;
  }

  set onerror(handler: Function) {
    this._listeners.error = handler;
  }

  set onabort(handler: Function) {
    this._listeners.abort = handler;
  }

  set ontimeout(handler: Function) {
    this._listeners.timeout = handler;
  }
}

global.XMLHttpRequest = MockXMLHttpRequest as any;

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
