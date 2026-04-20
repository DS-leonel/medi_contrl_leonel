import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppJwtModule } from '../app-jwt/app-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    AppJwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}