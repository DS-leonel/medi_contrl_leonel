import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './config/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppJwtModule } from './modules/app-jwt/app-jwt.module';

@Module({
  imports: [DatabaseModule,EnvModule, AuthModule, AppJwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
