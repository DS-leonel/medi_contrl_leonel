import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Cita } from 'src/modules/citas/entities/cita.entity';

@Entity('mensajes')
export class Mensaje {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    contenido: string;

    @Column({ name: 'sala_id' }) // ej: "cita-42"
    salaId: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'remitente_id' })
    remitente: User;

    @ManyToOne(() => Cita, { nullable: true })
    @JoinColumn({ name: 'cita_id' })
    cita: Cita; // null si es mensaje de soporte

    @CreateDateColumn()
    creadoEn: Date;
}