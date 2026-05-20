import { Expose, Type } from 'class-transformer';
import { UsuarioResponseDto } from './usuario-response.dto';

export class MensajeResponseDto {
  @Expose()
  id: number;

  @Expose()
  contenido: string;

  @Expose()
  @Type(() => UsuarioResponseDto)
  remitente: UsuarioResponseDto | null;
}
