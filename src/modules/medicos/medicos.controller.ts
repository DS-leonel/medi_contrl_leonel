import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { RolesGuard } from '../auth/guard/rol/rol.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Registrar médico (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Médico creado exitosamente' })
  @ApiResponse({ status: 403, description: 'El usuario no tiene rol MEDICO' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene perfil de médico' })
  crearMedico(@Body() dto: CreateMedicoDto) {
    return this.medicosService.crearMedico(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEDICO, Role.PACIENTE)
  @ApiOperation({ summary: 'Listar todos los médicos' })
  @ApiResponse({ status: 200, description: 'Lista de médicos' })
  findAll() {
    return this.medicosService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener médico por ID (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Médico encontrado' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.findById(id);
  }
}