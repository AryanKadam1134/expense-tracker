// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
}

// Request Payload Types
export type GoogleAuth = {
  credential: string;
  rememberMe: boolean;
};

export type Register = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type Login = {
  userCredential: string;
  password: string;
};
