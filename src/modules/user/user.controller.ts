import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserServiceInject } from './persistence/user.service';
import { UserService } from './user.service';
import { RequestWithUser } from '../auth/dto/auth.request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    @UserServiceInject()
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() { user }: RequestWithUser) {
    return this.userService.getProfile(user.id);
  }
}
