import { Expose } from 'class-transformer';

export class TicketResponseDto {
  @Expose()
  id: number;

  @Expose()
  descripcion: string;

  @Expose()
  estado: string;
}
