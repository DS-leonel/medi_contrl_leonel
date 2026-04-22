import { Role } from 'src/common/enum/roles.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'primer_nombre', length: 100 })
  primerNombre!: string;

  @Column({ name: 'segundo_nombre', length: 100, nullable: true })
  segundoNombre?: string | null;

  @Column({ name: 'primer_apellido', length: 100 })
  primerApellido!: string;

  @Column({ name: 'segundo_apellido', length: 100, nullable: true })
  segundoApellido?: string | null;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
