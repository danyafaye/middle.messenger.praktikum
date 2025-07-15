import { router, ROUTES } from '@router';
import { store } from '@store';
import { authApi, SignInData, UserData } from '@api';
import { fetchChats } from './chatService';

let pollingInterval: number | null = null;
let isUserAuthorized = false;
const POLLING_INTERVAL = 10_000;

export const getUserData = async (): Promise<UserData> => {
  try {
    const userData = await authApi.getUser();

    store.setState('user', userData);

    isUserAuthorized = true;

    try {
      await fetchChats();
    } catch (chatError) {
      console.error('Ошибка загрузки чатов:', chatError);
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);

    const isAuthError =
      (error instanceof Error && error.message.includes('401')) ||
      (error instanceof XMLHttpRequest && error.status === 401) ||
      (error && typeof error === 'object' && 'status' in error && error.status === 401);

    if (isAuthError) {
      handleUnauthorized();
    }

    throw error;
  }
};

const handleUnauthorized = (): void => {
  isUserAuthorized = false;
  stopUserPolling();

  store.setState('user', undefined);
  store.setState('chats', []);

  if (window.location.pathname !== ROUTES.SIGN_IN) {
    router.navigate(ROUTES.SIGN_IN);
  }
};

export const startUserPolling = (): void => {
  stopUserPolling();

  getUserData()
    .then(() => {
      if (isUserAuthorized) {
        pollingInterval = window.setInterval(() => {
          getUserData().catch(console.error);
        }, POLLING_INTERVAL);
      }
    })
    .catch(console.error);
};

export const stopUserPolling = (): void => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

export const isAuthenticated = (): boolean => {
  return isUserAuthorized;
};

export const login = async (credentials: SignInData): Promise<UserData> => {
  try {
    await authApi.signIn(credentials);
    const userData = await getUserData();

    startUserPolling();

    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authApi.logout();

    handleUnauthorized();

    router.navigate(ROUTES.SIGN_IN);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const authService = {
  getUserData,
  startUserPolling,
  stopUserPolling,
  isAuthenticated,
  login,
  logout,
};
