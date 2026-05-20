import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Cita } from 'src/modules/citas/entities/cita.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    ScheduleModule.forRoot(),
    ConfigModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
