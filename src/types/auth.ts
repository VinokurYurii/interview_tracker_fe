export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
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
