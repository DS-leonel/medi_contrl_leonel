import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { CitaStatus } from 'src/common/enum/CitaStatus.enum';
import { Paciente } from 'src/modules/pacientes/entities/paciente.entity';
import { Mensaje } from 'src/modules/mensajeria/chat/entities/mensaje.entity';

@Entity('citas')
export class Cita {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    fecha!: string;

    @Column({ type: 'time' })
    hora!: string;

    @Column({ type: 'enum', enum: CitaStatus, default: CitaStatus.PROGRAMADA })
    estado!: CitaStatus;

    // Relación ManyToOne con Paciente
    @ManyToOne(() => Paciente, (paciente) => paciente.citas, { eager: true, nullable: false })
    @JoinColumn({ name: 'paciente_id' })
    paciente!: Paciente;

    // Relación ManyToOne con Medico
    @ManyToOne(() => Medico, (medico) => medico.citas, { eager: true, nullable: false })
    @JoinColumn({ name: 'medico_id' })
    medico!: Medico;

    // Relación OneToMany con Mensaje
    @OneToMany(() => Mensaje, (mensaje) => mensaje.cita)
    mensajes: Mensaje[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}