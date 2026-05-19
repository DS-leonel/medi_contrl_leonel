import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Mensaje])],
    providers: [ChatGateway],
    exports: [TypeOrmModule],
})
export class ChatModule {}