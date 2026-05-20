import { Expose } from 'class-transformer';

export class UsuarioResponseDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  role: string;
}
