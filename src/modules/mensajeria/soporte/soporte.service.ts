import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketStatus } from 'src/common/enum/TicketStatus.enum';
import { Role } from 'src/common/enum/roles.enum';

@Injectable()
export class SoporteService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  // ─── Crear ticket (PACIENTE o MEDICO) ────────────────────────────────────
  async crearTicket(
    dto: CreateTicketDto,
    usuarioId: number,
  ): Promise<Ticket> {
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
  async listarTickets(
    usuarioId: number,
    role: Role,
  ): Promise<Ticket[]> {
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
    dto: UpdateTicketDto,
    role: Role,
  ): Promise<Ticket> {
    if (role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Solo el administrador puede cambiar el estado del ticket',
      );
    }

    const ticket = await this.findById(id);
    ticket.estado = dto.estado;
    return this.ticketRepository.save(ticket);
  }

  // ─── Reabrir ticket (usuario dueño) ──────────────────────────────────────
  async reabrirTicket(id: number, usuarioId: number): Promise<Ticket> {
    const ticket = await this.findById(id);

    // Solo el dueño del ticket puede reabrirlo
    if (ticket.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Solo el dueño del ticket puede reabrirlo',
      );
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
}