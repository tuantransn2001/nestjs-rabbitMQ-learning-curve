import mongoose from 'mongoose';
import { UserResponse } from 'apps/user-service/dto/user.response';

export class TokenPayload {
  sub: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
}

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
  refreshTokenExpire: number;
  lifeTime: number;
  refreshLifeTime: number;
}
