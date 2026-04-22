import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { Medico } from '../medicos/entities/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, Medico])],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService],
})
export class CitasModule {}
