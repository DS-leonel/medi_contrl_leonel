import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './config/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppJwtModule } from './modules/app-jwt/app-jwt.module';
import { MedicosModule } from './modules/medicos/medicos.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';

@Module({
  imports: [DatabaseModule,EnvModule, AuthModule, AppJwtModule, MedicosModule, PacientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
