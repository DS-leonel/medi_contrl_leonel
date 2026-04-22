import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enum/roles.enum';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {}

  // ─── CREAR PACIENTE ───────────────────────────────────────────────────────

  /**
   * Registra un nuevo perfil de paciente.
   * Valida que el usuario exista, tenga rol PACIENTE y no tenga perfil previo.
   */
  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const { usuario: usuarioId, ...datosPaciente } = createPacienteDto;

    // 1. Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // 2. VALIDACIÓN CRÍTICA: el usuario debe tener rol PACIENTE
    if (usuario.role !== Role.PACIENTE) {
      throw new ForbiddenException(
        `El usuario con ID ${usuarioId} no tiene el rol PACIENTE. ` +
        `Rol actual: ${usuario.role}. Solo usuarios con rol PACIENTE pueden registrarse como pacientes.`,
      );
    }

    // 3. Verificar que no exista ya un perfil de paciente para este usuario
    const perfilExistente = await this.pacienteRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });

    if (perfilExistente) {
      throw new ConflictException(
        `Ya existe un perfil de paciente asociado al usuario con ID ${usuarioId}`,
      );
    }

    // 4. Crear y guardar el paciente
    const nuevoPaciente = this.pacienteRepository.create({
      ...datosPaciente,
      usuario: { id: usuarioId },
    });

    const pacienteGuardado = await this.pacienteRepository.save(nuevoPaciente);

    // 5. Retornar con relaciones cargadas
    return this.findOne(pacienteGuardado.id);
  }

  // ─── LISTAR TODOS ─────────────────────────────────────────────────────────

  /**
   * Retorna todos los pacientes activos con sus relaciones básicas.
   * Solo accesible por ADMIN y MEDICO.
   */
  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find({
      where: { activo: true },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        fechaNacimiento: true,
        genero: true,
        telefonoContacto: true,
        direccion: true,
        tipoSangre: true,
        activo: true,
        createdAt: true,
        usuario: {
          id: true,
          email: true,
          role: true,
        },
      },
    });
  }

  // ─── BUSCAR POR ID ────────────────────────────────────────────────────────

  /**
   * Retorna un paciente con todas sus relaciones cargadas.
   * Incluye usuario y citas para datos completos.
   */
  async findOne(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['usuario', 'citas'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return paciente;
  }

  // ─── BUSCAR POR USUARIO ID ────────────────────────────────────────────────

  /**
   * Busca el perfil de paciente por ID de usuario.
   * Útil para que el propio paciente consulte su perfil desde el JWT.
   */
  async findByUsuarioId(usuarioId: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'citas'],
    });

    if (!paciente) {
      throw new NotFoundException(
        `No se encontró perfil de paciente para el usuario con ID ${usuarioId}`,
      );
    }

    return paciente;
  }

  // ─── ACTUALIZAR ───────────────────────────────────────────────────────────

  /**
   * Actualiza los datos de un paciente.
   * Valida existencia y aplica solo los campos enviados.
   */
  async update(id: number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(id);

    // Aplicar cambios parciales
    Object.assign(paciente, updatePacienteDto);

    await this.pacienteRepository.save(paciente);

    return this.findOne(id);
  }

  // ─── ELIMINAR (SOFT DELETE) ───────────────────────────────────────────────

  /**
   * Desactiva un paciente en lugar de eliminarlo físicamente.
   * Preserva historial de citas y datos médicos.
   */
  async remove(id: number): Promise<{ mensaje: string }> {
    const paciente = await this.findOne(id);

    if (!paciente.activo) {
      throw new BadRequestException(`El paciente con ID ${id} ya está inactivo`);
    }

    await this.pacienteRepository.update(id, { activo: false });

    return {
      mensaje: `Paciente con ID ${id} desactivado correctamente`,
    };
  }

  // ─── VERIFICAR ACCESO ─────────────────────────────────────────────────────

  /**
   * Verifica si un usuario tiene permiso para acceder al perfil de un paciente.
   * ADMIN puede acceder a todos; PACIENTE solo a su propio perfil.
   */
  async verificarAcceso(
    pacienteId: number,
    usuarioSolicitanteId: number,
    rolSolicitante: Role,
  ): Promise<void> {
    if (rolSolicitante === Role.ADMIN) return;

    const paciente = await this.findOne(pacienteId);

    if (paciente.usuario.id !== usuarioSolicitanteId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a la información de este paciente',
      );
    }
  }

  // ─── ESTADÍSTICAS BÁSICAS ─────────────────────────────────────────────────

  /**
   * Retorna estadísticas generales de pacientes (solo ADMIN).
   */
  async obtenerEstadisticas(): Promise<{
    total: number;
    activos: number;
    inactivos: number;
  }> {
    const total = await this.pacienteRepository.count();
    const activos = await this.pacienteRepository.count({ where: { activo: true } });

    return {
      total,
      activos,
      inactivos: total - activos,
    };
  }
}