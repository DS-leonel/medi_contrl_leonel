import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { TicketStatus } from 'src/common/enum/TicketStatus.enum';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ABIERTO,
  })
  estado!: TicketStatus;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: User;

  @Column({ name: 'usuario_id' })
  usuarioId!: number;

  // Sala única para el chat de soporte de este ticket
  // Formato: "soporte-ticket-{id}"
  @Column({ name: 'sala_id', unique: true, nullable: true })
  salaId!: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}