import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthServiceInject } from './persistence/auth.service';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @AuthServiceInject()
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    const user = await this.authService.authentication(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
