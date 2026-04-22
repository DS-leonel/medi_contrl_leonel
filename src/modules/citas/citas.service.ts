import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from 'src/modules/citas/entities/cita.entity';
import { CreateCitaDto } from 'src/modules/citas/dto/create-cita.dto';
import { UpdateCitaStatusDto } from 'src/modules/citas/dto/update-cita.dto';
import { CitaStatus } from 'src/common/enum/CitaStatus.enum'; // BIEN
import { Medico } from 'src/modules/medicos/entities/medico.entity';
import { Role } from 'src/common/enum/roles.enum';
import { Paciente } from '../pacientes/entities/paciente.entity';

type AuthUserPayload = { id: number; role: Role };

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  /**
   * Crear una nueva cita
   * Restricción: Solo usuarios con role PACIENTE pueden crear citas
   * Validación: El médico no puede tener otra cita con la misma fecha, hora y estado 'programada'
   */
  async create(createCitaDto: CreateCitaDto, user: AuthUserPayload): Promise<Cita> {
    // Restricción: Solo PACIENTE puede crear citas
    if (user.role !== Role.PACIENTE) {
      throw new ForbiddenException(
        'Solo los pacientes pueden crear citas',
      );
    }

    //Validar que el paciente exista (aunque debería existir porque el usuario es paciente)
    const paciente = await this.pacienteRepository.findOne({
      where: { usuario: { id: user.id } },
    });

      if (!paciente) {
        throw new NotFoundException('El paciente no existe');
      }

    // Validar que el médico exista
    const medico = await this.medicoRepository.findOne({
      where: { id: createCitaDto.medicoId },
    });

    if (!medico) {
      throw new NotFoundException('El médico especificado no existe');
    }

    // Validar disponibilidad: No puede existir otra cita del mismo médico
    // con la misma fecha, hora y estado 'programada'
    const citaExistente = await this.citaRepository.findOne({
      where: {
        medico: { id: medico.id },
        fecha: createCitaDto.fecha,
        hora: createCitaDto.hora,
        estado: CitaStatus.PROGRAMADA,
      },
    });

    if (citaExistente) {
      throw new ConflictException(
        'El médico ya tiene una cita programada en ese horario',
      );
    }

    // Crear la cita
    const cita = this.citaRepository.create({
      fecha: createCitaDto.fecha,
      hora: createCitaDto.hora,
      estado: CitaStatus.PROGRAMADA,
      paciente,
      medico,
    });

    return this.citaRepository.save(cita);
  }

  /**
   * Obtener todas las citas con filtro según el rol del usuario
   * ADMIN: Retorna todas las citas del sistema
   * MEDICO: Retorna solo las citas vinculadas a su medicoId
   * PACIENTE: Retorna solo las citas vinculadas a su userId
   */
  async findAll(user: AuthUserPayload): Promise<Cita[]> {
    if (user.role === Role.ADMIN) {
      // ADMIN ve todas las citas
      return this.citaRepository.find({
        relations: ['paciente', 'medico', 'medico.usuario'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    }

    if (user.role === Role.MEDICO) {
      // MEDICO ve solo sus citas
      const medico = await this.medicoRepository.findOne({
        where: { usuario: { id: user.id } },
      });

      if (!medico) {
        throw new ForbiddenException(
          'El usuario no tiene un perfil de médico asociado',
        );
      }

      return this.citaRepository.find({
        where: { medico: { id: medico.id } },
        relations: ['paciente', 'medico', 'medico.usuario'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    }

    if (user.role === Role.PACIENTE) {
      // PACIENTE ve solo sus citas
      return this.citaRepository.find({
        where: { paciente: { id: user.id } },
        relations: ['paciente', 'medico', 'medico.usuario'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    }

    throw new ForbiddenException('Rol no reconocido');
  }

  /**
   * Obtener una cita específica por ID
   */
  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['paciente', 'medico', 'medico.usuario'],
    });

    if (!cita) {
      throw new NotFoundException('La cita no existe');
    }

    return cita;
  }

  /**
   * Actualizar el estado de una cita
   * Restricción: Solo el MEDICO asignado a esa cita puede marcarla como 'completada'
   */
  async update(
    id: number,
    updateCitaStatusDto: UpdateCitaStatusDto,
    user: AuthUserPayload,
  ): Promise<Cita> {
    // Verificar que la cita exista
    const cita = await this.findOne(id);

    // Restricción: Solo el médico asignado puede marcar como completada
    if (updateCitaStatusDto.estado === CitaStatus.COMPLETADA) {
      if (user.role !== Role.MEDICO) {
        throw new ForbiddenException(
          'Solo el médico puede marcar una cita como completada',
        );
      }

      // Verificar que el médico actual sea el asignado a la cita
      const medicoDelUsuario = await this.medicoRepository.findOne({
        where: { usuario: { id: user.id } },
      });

      if (!medicoDelUsuario || medicoDelUsuario.id !== cita.medico.id) {
        throw new ForbiddenException(
          'Solo el médico asignado a esta cita puede completarla',
        );
      }
    }

    // Actualizar el estado
    cita.estado = updateCitaStatusDto.estado;
    return this.citaRepository.save(cita);
  }

  /**
   * Cancelar una cita
   * Restricción: Solo el PACIENTE dueño de la cita o un ADMIN pueden cancelar
   */
  async cancelar(id: number, user: AuthUserPayload): Promise<Cita> {
    // Verificar que la cita exista
    const cita = await this.findOne(id);

    // Validar permisos: Solo el paciente dueño o un admin pueden cancelar
    const esAdmin = user.role === Role.ADMIN;
    // En tu service
    const esPacienteDueño = user.role === Role.PACIENTE && Number(cita.paciente.id) === Number(user.id);

    if (!esAdmin && !esPacienteDueño) {
      throw new ForbiddenException(
        'Solo el paciente dueño o un admin pueden cancelar la cita',
      );
    }

    // Cambiar estado a cancelada
    cita.estado = CitaStatus.CANCELADA;
    return this.citaRepository.save(cita);
  }

  /**
   * Eliminar una cita de la base de datos
   */
  async remove(id: number): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }
}
