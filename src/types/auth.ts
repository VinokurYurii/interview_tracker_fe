export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  unread_notifications_count: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
}
