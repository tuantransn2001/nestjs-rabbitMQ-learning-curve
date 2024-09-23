import {
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './dto/auth.response.dto';
import mongoose from 'mongoose';
import { USER_SERVICE } from 'apps/user-service/constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { USER_EVENT } from 'apps/user-service/constants/event';
import { lastValueFrom } from 'rxjs';
import { AUTH_TOKEN_EVENT } from 'apps/auth-token-service/constants/event';
import { AUTH_TOKEN_SERVICE } from 'apps/auth-token-service/constants/service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  private async getProfileFromUserService(userId: mongoose.Types.ObjectId) {
    try {
      return lastValueFrom(
        this.userService.send(USER_EVENT.GET_PROFILE, userId),
      );
    } catch (error) {
      console.log('Error in getProfileFromUserService', error);
      throw new InternalServerErrorException("Can't get user profile");
    }
  }

  private async checkExistToken(token: string) {
    try {
      return lastValueFrom(
        this.authTokenService.send(AUTH_TOKEN_EVENT.CHECK_EXIST, token),
      );
    } catch (error) {
      console.log('Error in checkExistToken', error);
      throw new InternalServerErrorException("Can't check token");
    }
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

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const [userProfile, foundToken] = await Promise.all([
      this.getProfileFromUserService(new mongoose.Types.ObjectId(payload?.sub)),
      this.checkExistToken(token),
    ]);

    if (!!userProfile && !!foundToken) {
      const canActivate = (await super.canActivate(context)) as boolean;
      return canActivate;
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
