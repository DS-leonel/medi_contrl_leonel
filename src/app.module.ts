import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './config/env/env.module';

@Module({
  imports: [DatabaseModule,EnvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
