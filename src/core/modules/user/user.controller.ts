import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
// import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { jwtGuard } from '../auth/guard';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
