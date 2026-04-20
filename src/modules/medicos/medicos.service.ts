import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './entities/medico.entity';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UsersService } from '../users/users.service';
import { Role } from 'src/common/enum/roles.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
    private readonly usersService: UsersService,
  ) {}

  async crearMedico(dto: CreateMedicoDto): Promise<Medico> {
    const usuario = await this.usersService.findById(dto.usuarioId);

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.role !== Role.MEDICO) {
      throw new ForbiddenException(
        'El usuario no tiene rol MEDICO. Asígnalo primero.',
      );
    }

    const yaExiste = await this.medicoRepo.findOne({
      where: { usuario: { id: dto.usuarioId } },
    });

    if (yaExiste) {
      throw new ConflictException('Este usuario ya tiene un perfil de médico');
    }

    const medico = this.medicoRepo.create({
      especialidad: dto.especialidad,
      telefono: dto.telefono,
      usuario,
    });

    return this.medicoRepo.save(medico);
  }

  async findAll(): Promise<Medico[]> {
    return this.medicoRepo.find({
      relations: ['usuario'],
    });
  }

  async findById(id: number): Promise<Medico> {
    const medico = await this.medicoRepo.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }

    return medico;
  }

  // Para que CitasModule lo use internamente
  async findByUsuarioId(usuarioId: number): Promise<Medico> {
    const medico = await this.medicoRepo.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    if (!medico) {
      throw new NotFoundException('No existe perfil de médico para este usuario');
    }

    return medico;
  }
}