export type ProfileInfo = {
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  email: string;
};

export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};
