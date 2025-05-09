import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { UserPrismaRepository } from '../../../infrastructure/prisma/repositories/user.prisma.repository';
import { UserRepository } from '../../../domain/user/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
