import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
// import { UserService } from './user.service'; // For future use
// import { UserController } from './user.controller'; // For future use

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // controllers: [UserController], // For future use
  // providers: [UserService], // For future use
  // exports: [UserService], // If other modules need UserService
})
export class UserModule {}
