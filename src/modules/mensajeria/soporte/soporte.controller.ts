import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { SoporteService } from './soporte.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/rol/rol.guard';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

@ApiTags('Soporte')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('soporte/tickets')
export class SoporteController {
  constructor(private readonly soporteService: SoporteService) {}

  // ─── POST /soporte/tickets ────────────────────────────────────────────────
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.PACIENTE, Role.MEDICO)
  @ApiOperation({ summary: 'Crear ticket de soporte (PACIENTE o MEDICO)' })
  @ApiResponse({ status: 201, description: 'Ticket creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  crearTicket(@Body() dto: CreateTicketDto, @Req() req: Request) {
    const user = req['user'] as { id: number; role: Role };
    return this.soporteService.crearTicket(dto, user.id);
  }

  // ─── GET /soporte/tickets ─────────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary:
      'Listar tickets — ADMIN: todos | PACIENTE y MEDICO: solo los suyos',
  })
  @ApiResponse({ status: 200, description: 'Lista de tickets' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  listarTickets(@Req() req: Request) {
    const user = req['user'] as { id: number; role: Role };
    return this.soporteService.listarTickets(user.id, user.role);
  }

  // ─── GET /soporte/tickets/:id ─────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ticket por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ticket encontrado' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req['user'] as { id: number; role: Role };
    return this.soporteService.findById(id, user.id, user.role);
  }

  // ─── PATCH /soporte/tickets/:id/estado ───────────────────────────────────
  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cambiar estado del ticket (solo ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as { id: number; role: Role };
    return this.soporteService.cambiarEstado(id, dto.estado, user.role);
  }

  // ─── PATCH /soporte/tickets/:id/reabrir ──────────────────────────────────
  @Patch(':id/reabrir')
  @UseGuards(RolesGuard)
  @Roles(Role.PACIENTE, Role.MEDICO)
  @ApiOperation({ summary: 'Reabrir ticket resuelto (dueño del ticket)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ticket reabierto' })
  @ApiResponse({ status: 403, description: 'Sin permisos o ticket no resuelto' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  reabrirTicket(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req['user'] as { id: number; role: Role };
    return this.soporteService.reabrirTicket(id, user.id);
  }
}