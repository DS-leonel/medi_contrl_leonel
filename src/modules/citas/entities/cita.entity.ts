import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';


export enum CitaStatus {
  PROGRAMADA = 'PROGRAMADA',
  CANCELADA = 'CANCELADA',
  COMPLETADA = 'COMPLETADA'
}

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

/*     @ManyToOne(() => User, { eager: true, nullable: false })
    @JoinColumn({ name: 'paciente_id' })
    paciente!: User; */

    @Column({ name: 'paciente_id' })
    pacienteId!: number;

/*     @ManyToOne(() => User, { eager: true, nullable: false })
    @JoinColumn({ name: 'medico_id' })
    medico!: User;
 */
    @Column({ name: 'medico_id' })
    medicoId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}





