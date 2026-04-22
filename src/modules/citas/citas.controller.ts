import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaStatusDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita (solo para pacientes)' })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    type: Cita,
  })
  @ApiResponse({ status: 400, description: 'Médico no disponible en ese horario' })
  @ApiResponse({ status: 403, description: 'Solo los pacientes pueden crear citas' })
  async create(
    @Body() createCitaDto: CreateCitaDto,
    @Request() req: any,
  ): Promise<Cita> {
    const user: User = req.user;
    return this.citasService.create(createCitaDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener citas (filtradas por rol del usuario)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas',
    type: [Cita],
  })
  async findAll(@Request() req: any): Promise<Cita[]> {
    const user: User = req.user;
    return this.citasService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita específica por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cita encontrada',
    type: Cita,
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async findOne(@Param('id') id: string): Promise<Cita> {
    return this.citasService.findOne(+id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de la cita (solo médico asignado)' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: Cita,
  })
  @ApiResponse({ status: 403, description: 'Solo el médico asignado puede completar' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateCitaStatusDto: UpdateCitaStatusDto,
    @Request() req: any,
  ): Promise<Cita> {
    const user: User = req.user;
    return this.citasService.update(+id, updateCitaStatusDto, user);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar una cita (paciente o admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cita cancelada',
    type: Cita,
  })
  @ApiResponse({ status: 403, description: 'No tiene permisos para cancelar' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async cancelar(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Cita> {
    const user: User = req.user;
    return this.citasService.cancelar(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiResponse({ status: 204, description: 'Cita eliminada' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.citasService.remove(+id);
  }
}
