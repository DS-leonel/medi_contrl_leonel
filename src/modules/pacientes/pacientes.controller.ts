import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { AuthGuard } from '../auth/guard/auth/auth.guard';
import { RolesGuard } from '../auth/guard/rol/rol.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../../common/enum/roles.enum';

@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  // ─── POST /pacientes ───────────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo paciente',
    description:
      'Crea un perfil de paciente vinculado a un usuario existente con rol PACIENTE. ' +
      'Solo ADMIN puede ejecutar este endpoint. El servicio valida el rol antes de registrar.',
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente registrado exitosamente',
    type: Paciente,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 403, description: 'El usuario no tiene rol PACIENTE o sin permisos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un perfil de paciente para este usuario' })
  async create(@Body() createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    return this.pacientesService.create(createPacienteDto);
  }

  // ─── GET /pacientes ────────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN, Role.MEDICO)
  @ApiOperation({
    summary: 'Listar todos los pacientes activos',
    description:
      'Retorna la lista de pacientes activos con información básica y su usuario asociado. ' +
      'Accesible por ADMIN y MEDICO.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes obtenida exitosamente',
    type: [Paciente],
  })
  @ApiResponse({ status: 403, description: 'Acceso no autorizado' })
  async findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  // ─── GET /pacientes/estadisticas ──────────────────────────────────────────

  @Get('estadisticas')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Estadísticas generales de pacientes',
    description: 'Retorna conteo total, activos e inactivos. Solo ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas',
    schema: {
      example: { total: 120, activos: 115, inactivos: 5 },
    },
  })
  async obtenerEstadisticas() {
    return this.pacientesService.obtenerEstadisticas();
  }

  // ─── GET /pacientes/mi-perfil ─────────────────────────────────────────────

  @Get('mi-perfil')
  @Roles(Role.PACIENTE)
  @ApiOperation({
    summary: 'Consultar perfil propio del paciente autenticado',
    description:
      'El paciente autenticado consulta su propio perfil usando el ID del JWT. ' +
      'Incluye datos de usuario y citas asociadas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil propio del paciente',
    type: Paciente,
  })
  @ApiResponse({ status: 404, description: 'Perfil de paciente no encontrado' })
  async miPerfil(@Req() req: any): Promise<Paciente> {
    const usuarioId = req.user.id;
    return this.pacientesService.findByUsuarioId(usuarioId);
  }

  // ─── GET /pacientes/:id ────────────────────────────────────────────────────

  @Get(':id')
  @Roles(Role.ADMIN, Role.PACIENTE, Role.MEDICO)
  @ApiOperation({
    summary: 'Consultar paciente por ID',
    description:
      'Retorna información completa de un paciente con relaciones (usuario y citas). ' +
      'ADMIN accede a cualquier paciente; PACIENTE solo a su propio perfil.',
  })
  @ApiParam({ name: 'id', description: 'ID del paciente', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado con sus relaciones',
    type: Paciente,
  })
  @ApiResponse({ status: 403, description: 'Sin permisos para acceder a este paciente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Paciente> {
    // Verificar acceso antes de retornar datos
    await this.pacientesService.verificarAcceso(
      id,
      req.user.id,
      req.user.role as Role,
    );

    return this.pacientesService.findOne(id);
  }

  // ─── PATCH /pacientes/:id ──────────────────────────────────────────────────

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PACIENTE)
  @ApiOperation({
    summary: 'Actualizar datos de un paciente',
    description:
      'Actualiza parcialmente el perfil de un paciente. ' +
      'ADMIN puede actualizar cualquier paciente; PACIENTE solo el suyo propio.',
  })
  @ApiParam({ name: 'id', description: 'ID del paciente a actualizar', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paciente actualizado exitosamente',
    type: Paciente,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos para modificar este paciente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePacienteDto: UpdatePacienteDto,
    @Req() req: any,
  ): Promise<Paciente> {
    // Verificar acceso antes de actualizar
    await this.pacientesService.verificarAcceso(
      id,
      req.user.id,
      req.user.role as Role,
    );

    return this.pacientesService.update(id, updatePacienteDto);
  }

  // ─── DELETE /pacientes/:id ─────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Desactivar un paciente (soft delete)',
    description:
      'Desactiva el perfil del paciente sin eliminarlo físicamente, ' +
      'preservando el historial de citas. Solo ADMIN.',
  })
  @ApiParam({ name: 'id', description: 'ID del paciente a desactivar', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paciente desactivado exitosamente',
    schema: { example: { mensaje: 'Paciente con ID 3 desactivado correctamente' } },
  })
  @ApiResponse({ status: 400, description: 'El paciente ya estaba inactivo' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ mensaje: string }> {
    return this.pacientesService.remove(id);
  }
}