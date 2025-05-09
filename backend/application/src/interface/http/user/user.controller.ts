import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from '../../../shared/interfaces/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('balances')
  async getBalances(@Req() req: RequestWithUser) {
    return await this.userService.getUserBalances(req.user.userId);
  }
}
