import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserServiceInject } from './persistence/user.service';
import { UserService } from './user.service';
import { RequestWithUser } from '../auth/dto/auth.request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUtil } from 'src/common/utils/request/request-utils';

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

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ) {
    const pagination = RequestUtil.getRequest(page, limit, sort);
    return this.userService.getListUser(pagination);
  }
}
