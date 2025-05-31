export interface UserFields {
  email: string;
  password: string;
  refreshToken: string;
  role: "admin" | "user";
  __confirmPassword: string;
  displayName: string;
  googleID?: string;
}