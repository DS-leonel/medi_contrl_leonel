import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { Medico } from '../medicos/entities/medico.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { EmailModule } from '../mensajeria/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita, Medico, Paciente]),
    forwardRef(() => EmailModule),
  ],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService],
})
export class CitasModule {}
