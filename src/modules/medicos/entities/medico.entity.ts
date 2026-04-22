import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Cita } from '../../citas/entities/cita.entity';


@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  especialidad: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @OneToMany(() => Cita, (cita) => cita.medico)
  citas: Cita[];
}