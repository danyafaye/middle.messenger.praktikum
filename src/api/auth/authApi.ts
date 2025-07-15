import { API_ENDPOINTS, baseApi, SignInData, UserData } from '@api';
import { SignUpData } from '@api';

export const authApi = {
  signUp: (data: SignUpData) => baseApi.post(`${API_ENDPOINTS.AUTH}/signup`, data),
  signIn: (data: SignInData) => baseApi.post(`${API_ENDPOINTS.AUTH}/signin`, data),
  getUser: () => baseApi.get<UserData>(`${API_ENDPOINTS.AUTH}/user`),
  logout: () => baseApi.post(`${API_ENDPOINTS.AUTH}/logout`, {}),
};
