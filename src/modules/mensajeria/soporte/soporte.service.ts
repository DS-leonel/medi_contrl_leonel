import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from 'src/common/enum/TicketStatus.enum';
import { Role } from 'src/common/enum/roles.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Mensaje } from '../chat/entities/mensaje.entity';

@Injectable()
export class SoporteService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
  ) {}

  // ─── Crear ticket (PACIENTE o MEDICO) ────────────────────────────────────
  async crearTicket(dto: CreateTicketDto, usuarioId: number): Promise<Ticket> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
    // Crear el ticket primero para obtener el id
    const ticket = this.ticketRepository.create({
      descripcion: dto.descripcion,
      estado: TicketStatus.ABIERTO,
      usuarioId,
    });

    const guardado = await this.ticketRepository.save(ticket);

    // Asignar el salaId usando el id generado
    guardado.salaId = `soporte-ticket-${guardado.id}`;
    return this.ticketRepository.save(guardado);
  }

  // ─── Listar tickets ───────────────────────────────────────────────────────
  // ADMIN: ve todos los tickets del sistema
  // PACIENTE / MEDICO: solo ven los suyos
  async listarTickets(usuarioId: number, role: Role): Promise<Ticket[]> {
    if (role === Role.ADMIN) {
      return this.ticketRepository.find({
        relations: ['usuario'],
        order: { creadoEn: 'DESC' },
      });
    }

    return this.ticketRepository.find({
      where: { usuarioId },
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });
  }

  // ─── Obtener ticket por ID ────────────────────────────────────────────────
  async findById(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no encontrado`);
    }

    return ticket;
  }

  // ─── Cambiar estado (solo ADMIN) ──────────────────────────────────────────
  async cambiarEstado(
    id: number,
    estado: TicketStatus,
    role: Role,
  ): Promise<Ticket> {
    if (role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Solo el administrador puede cambiar el estado del ticket',
      );
    }

    const ticket = await this.findById(id);
    ticket.estado = estado;
    return this.ticketRepository.save(ticket);
  }

  // ─── Reabrir ticket (usuario dueño) ──────────────────────────────────────
  async reabrirTicket(id: number, usuarioId: number): Promise<Ticket> {
    const ticket = await this.findById(id);

    // Solo el dueño del ticket puede reabrirlo
    if (ticket.usuarioId !== usuarioId) {
      throw new ForbiddenException('Solo el dueño del ticket puede reabrirlo');
    }

    // Solo se pueden reabrir tickets resueltos
    if (ticket.estado !== TicketStatus.RESUELTO) {
      throw new ForbiddenException(
        `No se puede reabrir un ticket con estado "${ticket.estado}"`,
      );
    }

    ticket.estado = TicketStatus.ABIERTO;
    return this.ticketRepository.save(ticket);
  }

  async procesarMensaje(
    ticketId: number,
    contenido: string,
    userId: number,
    role: Role,
  ): Promise<{ mensaje: Mensaje; ticket: Ticket }> {
    const ticket = await this.findById(ticketId);

    this.validarParticipante(ticket.usuario.id, userId, role);
    this.validarTicketAbierto(ticket.estado);

    const remitente = await this.findUsuarioOrFail(userId);
    const mensaje = await this.mensajeRepository.save(
      this.mensajeRepository.create({
        contenido,
        salaId: ticket.salaId,
        remitente,
        cita: null,
      }),
    );

    let ticketActualizado = ticket;
    if (ticket.estado === TicketStatus.ABIERTO) {
      ticketActualizado = await this.cambiarEstado(
        ticket.id,
        TicketStatus.EN_ATENCION,
        Role.ADMIN,
      );
    }

    return { mensaje, ticket: ticketActualizado };
  }

  async obtenerHistorial(salaId: string): Promise<Mensaje[]> {
    return this.mensajeRepository.find({
      where: { salaId },
      order: { creadoEn: 'ASC' },
    });
  }

  async findUsuarioOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('El usuario no existe');
    return user;
  }

  validarParticipante(ownerId: number, userId: number, role?: Role) {
    if (role === Role.ADMIN) return;
    if (ownerId !== userId)
      throw new ForbiddenException('No tienes acceso a este ticket');
  }

  private validarTicketAbierto(estado: TicketStatus) {
    if (estado === TicketStatus.RESUELTO) {
      throw new ForbiddenException(
        'No se pueden enviar mensajes en un ticket cerrado',
      );
    }
  }
}