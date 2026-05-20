import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './config/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppJwtModule } from './modules/app-jwt/app-jwt.module';
import { MedicosModule } from './modules/medicos/medicos.module';
import { CitasModule } from './modules/citas/citas.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { EmailModule } from './modules/mensajeria/email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    EnvModule,
    AuthModule,
    AppJwtModule,
    MedicosModule,
    PacientesModule,
    CitasModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
