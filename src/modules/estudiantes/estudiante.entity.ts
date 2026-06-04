import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  nombre: string;

  @Column()
  @ApiProperty()
  apellido: string;

  @Column({ unique: true })
  @ApiProperty()
  cedula: string;
}