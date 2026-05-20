import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './config/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppJwtModule } from './modules/app-jwt/app-jwt.module';
import { MedicosModule } from './modules/medicos/medicos.module';
import { CitasModule } from './modules/citas/citas.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { ChatModule } from './modules/mensajeria/chat/chat.module';
import { SoporteModule } from './modules/mensajeria/soporte/soporte.module';
import { EmailModule } from './modules/mensajeria/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    EnvModule,
    AuthModule,
    AppJwtModule,
    MedicosModule,
    PacientesModule,
    CitasModule,
    ChatModule,
    SoporteModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}