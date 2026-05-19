import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
    @IsNumber()
    @IsNotEmpty()
    citaId: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    contenido: string;
}