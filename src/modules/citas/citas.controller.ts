import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/rol/rol.guard';
import { CitasService } from 'src/modules/citas/citas.service';
import { CreateCitaDto } from 'src/modules/citas/dto/create-cita.dto';
import { UpdateCitaStatusDto } from 'src/modules/citas/dto/update-cita.dto';
import { Cita } from 'src/modules/citas/entities/cita.entity';

@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
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
    @Req() req: Request,
  ): Promise<Cita> {
    const user = req['user'] as { id: number; role: Role };
    return this.citasService.create(createCitaDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener citas (filtradas por rol del usuario)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas',
    type: [Cita],
  })
  async findAll(@Req() req: Request): Promise<Cita[]> {
    const user = req['user'] as { id: number; role: Role };
    return this.citasService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener una cita específica por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cita encontrada',
    type: Cita,
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @Patch(':id/estado')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MEDICO)
  @ApiOperation({ summary: 'Actualizar estado de la cita (solo médico asignado)' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: Cita,
  })
  @ApiResponse({ status: 403, description: 'Solo el médico asignado puede completar' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCitaStatusDto: UpdateCitaStatusDto,
    @Req() req: Request,
  ): Promise<Cita> {
    const user = req['user'] as { id: number; role: Role };
    return this.citasService.update(id, updateCitaStatusDto, user);
  }

  @Patch(':id/cancelar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.PACIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Cancelar una cita (paciente o admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cita cancelada',
    type: Cita,
  })
  @ApiResponse({ status: 403, description: 'No tiene permisos para cancelar' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<Cita> {
    const user = req['user'] as { id: number; role: Role };
    return this.citasService.cancelar(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiResponse({ status: 204, description: 'Cita eliminada' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.citasService.remove(id);
  }
}
