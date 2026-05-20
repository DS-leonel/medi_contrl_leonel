import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Mensaje } from './entities/mensaje.entity';
import { Cita } from 'src/modules/citas/entities/cita.entity';
import { AppJwtModule } from 'src/modules/app-jwt/app-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensaje, Cita]),
    AppJwtModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
