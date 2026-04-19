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
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign.role.dto';
import { Role } from './entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─────────────────────────────────────────────
  // POST /users — Solo ADMIN
  // ─────────────────────────────────────────────
  @Post()
  @UseGuards(AuthGuard, RolesGuard)  // Primero autentica, luego verifica rol
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear usuario (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)  
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  getProfile(@Req() req: Request) {
    const user = req['user'] as { id: number };
    return this.usersService.findById(user.id);
  }
  
  @Patch(':id/role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Asignar rol (solo ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.usersService.assignRole(id, assignRoleDto);
  }
}