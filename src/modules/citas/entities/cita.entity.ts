import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { CitaStatus } from 'src/common/enum/CitaStatus.enum'; // BIEN
import { Paciente } from 'src/modules/pacientes/entities/paciente.entity';

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

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}





