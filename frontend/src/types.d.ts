export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  googleId?: string;
}
export interface IActivity {
  _id: string;
  user: {
    _id: string;
    email: string;
    displayName?: string;
  };
  title: string;
  description: string;
  image: string | null;
  isPublished: boolean;
}

export interface ActivityMutation {
  title: string;
  description: string;
  image?: File | null;
}

export interface IGroup {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    email: string;
  };
  activity: {
    _id: string;
    title: string;
    image?: string;
    description: string;
    isPublished?: boolean;
  };
  participants: {
    _id: string;
    displayName: string;
    email: string;
  }[];
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
