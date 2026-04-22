import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';
import { Medico } from './entities/medico.entity';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Medico]),
    UsersModule,
    
  ],
  controllers: [MedicosController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}