import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module'; // <-- Import the module


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  NotificationsModule,
], // Make the User entity available to this module.
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}