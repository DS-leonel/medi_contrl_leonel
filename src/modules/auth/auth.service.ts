import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enum/roles.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    /* PENSAR QUE ES PUBLICO, NO DICE QUE ES PRIVADO, 
    POR LO CUAL SE INTUYE QUE SOLO ES PARA PACIENTES, PORQUE O SI NO SE CHOCARIA
    CON EL CREAR USUARIOS(ADMIN) */

    /*     if (registerDto.role !== Role.PACIENTE) {
      throw new BadRequestException(
        'Solo se pueden registrar usuarios con rol PACIENTE',
      );
    } */

    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
    };
  }
}
