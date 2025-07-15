import { createHTTPTransport } from '@api';
import { store } from '@store';

const BASE_URL = 'https://ya-praktikum.tech/api/v2';
export const BASE_URL_RESOURCES = 'https://ya-praktikum.tech/api/v2/resources';

const httpTransport = createHTTPTransport();

const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const API_ENDPOINTS = {
  USERS: '/user',
  CHATS: '/chats',
  CHAT_USERS: '/chats/users',
  GET_CHAT_USERS: (chatId: number) => `/chats/${chatId}/users`,
  CHAT_TOKEN: (chatId: number) => `/chats/token/${chatId}`,
  AUTH: '/auth',
};

export const baseApi = {
  async get<ReturnType>(endpoint: string, options = {}, storePath?: string): Promise<ReturnType> {
    try {
      const response = await httpTransport.get(`${BASE_URL}${endpoint}`, options);

      let data: ReturnType;

      if (response.responseText && isValidJSON(response.responseText)) {
        data = JSON.parse(response.responseText) as ReturnType;
      } else {
        data = response.responseText as unknown as ReturnType;
      }

      if (storePath) {
        store.setState(storePath, data);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  async post<PayloadType, ReturnType>(
    endpoint: string,
    data?: PayloadType,
    storePath?: string
  ): Promise<ReturnType> {
    try {
      const isFormData = data instanceof FormData;
      const response = await httpTransport.post(`${BASE_URL}${endpoint}`, {
        data: isFormData ? data : JSON.stringify(data),
        headers: isFormData
          ? {}
          : {
              'Content-Type': 'application/json',
            },
      });

      let responseData: ReturnType;

      if (response.responseText && isValidJSON(response.responseText)) {
        responseData = JSON.parse(response.responseText) as ReturnType;
      } else {
        responseData = response.responseText as unknown as ReturnType;
      }

      if (storePath) {
        store.setState(storePath, responseData);
      }

      return responseData;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },

  async put<PayloadType, ReturnType>(
    endpoint: string,
    data: PayloadType,
    storePath?: string
  ): Promise<ReturnType> {
    try {
      const isFormData = data instanceof FormData;
      const response = await httpTransport.put(`${BASE_URL}${endpoint}`, {
        data: isFormData ? data : JSON.stringify(data),
        headers: isFormData
          ? {}
          : {
              'Content-Type': 'application/json',
            },
      });

      let responseData: ReturnType;

      if (response.responseText && isValidJSON(response.responseText)) {
        responseData = JSON.parse(response.responseText) as ReturnType;
      } else {
        responseData = response.responseText as unknown as ReturnType;
      }

      if (storePath) {
        store.setState(storePath, responseData);
      }
      return responseData;
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      throw error;
    }
  },

  async delete<PayloadType, ReturnType>(
    endpoint: string,
    data: PayloadType,
    storePath?: string
  ): Promise<ReturnType> {
    try {
      const isFormData = data instanceof FormData;
      const response = await httpTransport.delete(`${BASE_URL}${endpoint}`, {
        data: isFormData ? data : JSON.stringify(data),
        headers: isFormData
          ? {}
          : {
              'Content-Type': 'application/json',
            },
      });

      let responseData: ReturnType;

      if (response.responseText && isValidJSON(response.responseText)) {
        responseData = JSON.parse(response.responseText) as ReturnType;
      } else {
        responseData = response.responseText as unknown as ReturnType;
      }

      if (storePath) {
        store.setState(storePath, responseData);
      }

      return responseData;
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      throw error;
    }
  },
};
