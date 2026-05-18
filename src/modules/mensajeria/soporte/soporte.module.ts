import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { SoporteController } from './soporte.controller';
import { SoporteService } from './soporte.service';
import { AppJwtModule } from 'src/modules/app-jwt/app-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    AppJwtModule, // necesario para que AuthGuard tenga el JwtService
  ],
  controllers: [SoporteController],
  providers: [SoporteService],
  exports: [SoporteService], // exportado para que el Integrante 5 lo use en el gateway
})
export class SoporteModule {}