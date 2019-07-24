

export interface User extends Document {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly isAdmin: boolean;
  readonly isVerified: boolean;
  readonly verificationCode: string;
}
