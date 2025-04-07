import { queryStringify } from '@utils';
import { HttpMethod, METHODS, RequestOptions } from '@models';

export const createHTTPTransport = () => {
  const request = (
    url: string,
    options: { method: HttpMethod } & RequestOptions,
    timeout = 5000
  ): Promise<XMLHttpRequest> => {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let resultUrl = url;
      if (method === METHODS.GET && data) {
        resultUrl = `${url}?${queryStringify(data as unknown as Record<string, string | number | boolean>)}`;
      }
      xhr.open(method, resultUrl);
      xhr.timeout = timeout;
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Request error'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };

  return {
    get: (url: string, options: RequestOptions = {}) =>
      request(url, { ...options, method: METHODS.GET }, options.timeout ?? 5000),
    put: (url: string, options: RequestOptions = {}) =>
      request(url, { ...options, method: METHODS.PUT }, options.timeout ?? 5000),
    post: (url: string, options: RequestOptions = {}) =>
      request(url, { ...options, method: METHODS.POST }, options.timeout ?? 5000),
    delete: (url: string, options: RequestOptions = {}) =>
      request(url, { ...options, method: METHODS.DELETE }, options.timeout ?? 5000),
    request,
  };
};
