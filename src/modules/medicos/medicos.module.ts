import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';
import { Medico } from './entities/medico.entity';
import { UsersModule } from '../users/users.module';
import { AppJwtModule } from '../app-jwt/app-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medico]),
    UsersModule,
    AppJwtModule,
  ],
  controllers: [MedicosController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}