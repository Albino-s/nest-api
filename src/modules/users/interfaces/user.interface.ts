

export interface User {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  isAdmin: boolean;
  isVerified: boolean;
  readonly verificationCode: string;
}
