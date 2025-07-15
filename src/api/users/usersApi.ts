import { ChangePasswordData, ProfileInfo, UserData } from '@api';
import { API_ENDPOINTS, baseApi } from '@api';

export const usersApi = {
  changeUserProfileInfo: (data: ProfileInfo) => baseApi.put(`${API_ENDPOINTS.USERS}/profile`, data),
  changeUserPassword: (data: ChangePasswordData) =>
    baseApi.put(`${API_ENDPOINTS.USERS}/password`, data),
  changeUserAvatar: (data: FormData) =>
    baseApi.put<FormData, UserData>(`${API_ENDPOINTS.USERS}/profile/avatar`, data),
};
