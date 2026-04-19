import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  MEDICO = 'MEDICO',
  PACIENTE = 'PACIENTE',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PACIENTE,
  })
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}