export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  googleId?: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

export interface GlobalError {
  error: string;
}
