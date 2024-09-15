import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthTokenRepositoryInject } from '../auth-token/persistence/auth-token.repository';
import { AuthTokenRepository } from '../auth-token/repository/auth-token.repository';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './dto/auth.response.dto';
import mongoose from 'mongoose';
import { UserServiceInject } from '../user/persistence/user.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @AuthTokenRepositoryInject()
    private readonly authTokenRepository: AuthTokenRepository,
    @UserServiceInject()
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    let payload: TokenPayload;

    try {
      payload = this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const [userProfile, authTokens] = await Promise.all([
      this.userService.getProfile(new mongoose.Types.ObjectId(payload.sub)),
      this.authTokenRepository.findAll({
        userId: new mongoose.Types.ObjectId(payload.sub),
        token,
      }),
    ]);

    if (!!userProfile && authTokens.length > 0) {
      const canActivate = (await super.canActivate(context)) as boolean;
      return canActivate;
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
