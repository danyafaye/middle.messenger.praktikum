jest.mock('./baseFetch', () => {
  const mockTransport = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    request: jest.fn(),
  };

  return {
    createHTTPTransport: jest.fn(() => mockTransport),
  };
});

jest.mock('@store', () => ({
  store: {
    setState: jest.fn(),
  },
}));

import { baseApi } from './baseApi';
import { createHTTPTransport } from './baseFetch';

const mockTransport = (createHTTPTransport as jest.Mock)();

describe('baseApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('метод GET', () => {
    it('должен выполнить GET запрос и вернуть JSON данные', async () => {
      const mockResponse = {
        responseText: '{"id": 1, "name": "test"}',
      };
      const expectedData = { id: 1, name: 'test' };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get('/test-endpoint');

      expect(mockTransport.get).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/test-endpoint',
        {}
      );
      expect(result).toEqual(expectedData);
    });

    it('должен вернуть текст если ответ не является JSON', async () => {
      const mockResponse = {
        responseText: 'plain text response',
      };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get<string>('/test-endpoint');

      expect(result).toBe('plain text response');
    });

    it('должен сохранить данные в store если передан storePath', async () => {
      const mockResponse = {
        responseText: '{"data": "test"}',
      };
      const storePath = 'testPath';

      mockTransport.get.mockResolvedValue(mockResponse);

      await baseApi.get('/test-endpoint', {}, storePath);

      expect(require('@store').store.setState).toHaveBeenCalledWith(storePath, { data: 'test' });
    });

    it('должен обработать ошибку и пробросить её дальше', async () => {
      const error = new Error('Network error');
      mockTransport.get.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(baseApi.get('/test-endpoint')).rejects.toThrow('Network error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching /test-endpoint:', error);

      consoleSpy.mockRestore();
    });

    it('должен обработать пустой ответ', async () => {
      const mockResponse = {
        responseText: '',
      };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get('/test-endpoint');

      expect(result).toBe('');
    });
  });

  describe('метод POST', () => {
    it('должен выполнить POST запрос с JSON данными', async () => {
      const mockResponse = {
        responseText: '{"success": true}',
      };
      const postData = { name: 'test', value: 123 };

      mockTransport.post.mockResolvedValue(mockResponse);

      const result = await baseApi.post('/test-endpoint', postData);

      expect(mockTransport.post).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/test-endpoint',
        {
          data: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual({ success: true });
    });

    it('должен выполнить POST запрос с FormData', async () => {
      const mockResponse = {
        responseText: '{"uploaded": true}',
      };
      const formData = new FormData();
      formData.append('file', 'test');

      mockTransport.post.mockResolvedValue(mockResponse);

      const result = await baseApi.post('/upload', formData);

      expect(mockTransport.post).toHaveBeenCalledWith('https://ya-praktikum.tech/api/v2/upload', {
        data: formData,
        headers: {},
      });
      expect(result).toEqual({ uploaded: true });
    });

    it('должен выполнить POST запрос без данных', async () => {
      const mockResponse = {
        responseText: '{"created": true}',
      };

      mockTransport.post.mockResolvedValue(mockResponse);

      const result = await baseApi.post('/test-endpoint');

      expect(mockTransport.post).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/test-endpoint',
        {
          data: undefined,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual({ created: true });
    });

    it('должен сохранить данные в store', async () => {
      const mockResponse = {
        responseText: '{"id": 1}',
      };
      const storePath = 'newItem';

      mockTransport.post.mockResolvedValue(mockResponse);

      await baseApi.post('/test-endpoint', { name: 'test' }, storePath);

      expect(require('@store').store.setState).toHaveBeenCalledWith(storePath, { id: 1 });
    });
  });

  describe('метод PUT', () => {
    it('должен выполнить PUT запрос с JSON данными', async () => {
      const mockResponse = {
        responseText: '{"updated": true}',
      };
      const putData = { id: 1, name: 'updated' };

      mockTransport.put.mockResolvedValue(mockResponse);

      const result = await baseApi.put('/test-endpoint', putData);

      expect(mockTransport.put).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/test-endpoint',
        {
          data: JSON.stringify(putData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual({ updated: true });
    });

    it('должен выполнить PUT запрос с FormData', async () => {
      const mockResponse = {
        responseText: '{"updated": true}',
      };
      const formData = new FormData();
      formData.append('avatar', 'image');

      mockTransport.put.mockResolvedValue(mockResponse);

      const result = await baseApi.put('/profile/avatar', formData);

      expect(mockTransport.put).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/profile/avatar',
        {
          data: formData,
          headers: {},
        }
      );
      expect(result).toEqual({ updated: true });
    });
  });

  describe('метод DELETE', () => {
    it('должен выполнить DELETE запрос', async () => {
      const mockResponse = {
        responseText: '{"deleted": true}',
      };
      const deleteData = { id: 1 };

      mockTransport.delete.mockResolvedValue(mockResponse);

      const result = await baseApi.delete('/test-endpoint', deleteData);

      expect(mockTransport.delete).toHaveBeenCalledWith(
        'https://ya-praktikum.tech/api/v2/test-endpoint',
        {
          data: JSON.stringify(deleteData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('валидация JSON', () => {
    it('должен корректно определить валидный JSON', async () => {
      const mockResponse = {
        responseText: '{"valid": true}',
      };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get('/test');

      expect(result).toEqual({ valid: true });
    });

    it('должен корректно обработать невалидный JSON', async () => {
      const mockResponse = {
        responseText: 'invalid json {',
      };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get<string>('/test');

      expect(result).toBe('invalid json {');
    });

    it('должен обработать null responseText', async () => {
      const mockResponse = {
        responseText: null,
      };

      mockTransport.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get('/test');

      expect(result).toBe(null);
    });
  });

  describe('обработка ошибок', () => {
    it('должен обработать ошибку POST запроса', async () => {
      const error = new Error('Server error');
      mockTransport.post.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(baseApi.post('/test', {})).rejects.toThrow('Server error');

      expect(consoleSpy).toHaveBeenCalledWith('Error posting to /test:', error);

      consoleSpy.mockRestore();
    });

    it('должен обработать ошибку PUT запроса', async () => {
      const error = new Error('Update failed');
      mockTransport.put.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(baseApi.put('/test', {})).rejects.toThrow('Update failed');

      expect(consoleSpy).toHaveBeenCalledWith('Error putting to /test:', error);

      consoleSpy.mockRestore();
    });

    it('должен обработать ошибку DELETE запроса', async () => {
      const error = new Error('Delete failed');
      mockTransport.delete.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(baseApi.delete('/test', {})).rejects.toThrow('Delete failed');

      expect(consoleSpy).toHaveBeenCalledWith('Error deleting /test:', error);

      consoleSpy.mockRestore();
    });
  });
});
