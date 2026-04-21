import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity';
import { User } from '../users/entities/user.entity';

/**
 * PacientesModule
 *
 * Gestiona el ciclo de vida de los pacientes en el sistema médico.
 * - Importa TypeORM con Paciente y Usuario para acceso a repositorios.
 * - Exporta PacientesService para que otros módulos (ej. CitasModule)
 *   puedan validar la existencia de pacientes sin importar el módulo completo.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, User]),
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}