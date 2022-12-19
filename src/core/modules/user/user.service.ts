import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email as string,
        firstName: dto.firstName as string,
        lastName: dto.lastname as string,
      },
    });

    delete user.hash;
    return user;
  }
}
