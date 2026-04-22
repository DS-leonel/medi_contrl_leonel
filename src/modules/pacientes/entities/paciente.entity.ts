import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
//import { Cita } from '../../citas/entities/cita.entity';

@Entity('pacientes')
export class Paciente {
  @ApiProperty({ description: 'ID único del paciente' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha de nacimiento del paciente' })
  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @ApiProperty({ description: 'Género del paciente' })
  @Column({ length: 20 })
  genero: string;

  @ApiProperty({ description: 'Número de teléfono de contacto' })
  @Column({ length: 20, name: 'telefono_contacto' })
  telefonoContacto: string;

  @ApiProperty({ description: 'Dirección de residencia' })
  @Column({ length: 255 })
  direccion: string;

  @ApiProperty({ description: 'Tipo de sangre del paciente' })
  @Column({ length: 5, name: 'tipo_sangre', nullable: true })
  tipoSangre: string;

  @ApiProperty({ description: 'Alergias conocidas del paciente' })
  @Column({ type: 'text', nullable: true })
  alergias: string;

  @ApiProperty({ description: 'Enfermedades crónicas conocidas' })
  @Column({ type: 'text', name: 'enfermedades_cronicas', nullable: true })
  enfermedadesCronicas: string;

  @ApiProperty({ description: 'Nombre del contacto de emergencia' })
  @Column({ length: 150, name: 'contacto_emergencia_nombre', nullable: true })
  contactoEmergenciaNombre: string;

  @ApiProperty({ description: 'Teléfono del contacto de emergencia' })
  @Column({ length: 20, name: 'contacto_emergencia_telefono', nullable: true })
  contactoEmergenciaTelefono: string;

  @ApiProperty({ description: 'Estado activo del paciente' })
  @Column({ default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de registro' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // --- Relaciones ---

  @ApiProperty({ description: 'Usuario asociado al paciente' })
  @OneToOne(() => User, { eager: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  //@ApiProperty({ description: 'Citas del paciente' })
  //@OneToMany(() => Cita, (cita) => cita.paciente, { eager: false })
  //citas: Cita[];
}