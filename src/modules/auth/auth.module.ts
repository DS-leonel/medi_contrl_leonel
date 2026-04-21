import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AppJwtModule } from '../app-jwt/app-jwt.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, AppJwtModule, 
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AppJwtModule, PassportModule],
})
export class AuthModule {}
