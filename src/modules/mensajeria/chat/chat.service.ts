import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Cita } from 'src/modules/citas/entities/cita.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,

    @InjectRepository(Cita)
    private citaRepository: Repository<Cita>,
  ) {}

  // Guarda un mensaje nuevo en la BD
  async guardarMensaje(
  salaId: string,
  contenido: string,
  remitenteId: number,
  citaId: number,
): Promise<Mensaje> {
  const mensaje = this.mensajeRepository.create({
    salaId,
    contenido,
    remitente: { id: remitenteId } as any, // TypeORM acepta esto para FK
    cita: { id: citaId } as any,
  });
  return await this.mensajeRepository.save(mensaje);
}

  // Trae todos los mensajes de una sala (historial)
  async obtenerHistorial(salaId: string): Promise<Mensaje[]> {
    return await this.mensajeRepository.find({
      where: { salaId },
      order: { creadoEn: 'ASC' },
    });
  }

  // Verifica que el usuario sea el paciente o el médico de esa cita
 async validarAccesoSala(
  citaId: number,
  userId: number,
): Promise<boolean> {
  const cita = await this.citaRepository.findOne({
    where: { id: citaId },
    relations: ['paciente', 'paciente.usuario', 'medico', 'medico.usuario'],
  });

  if (!cita) return false;

  const esPaciente = cita.paciente?.usuario?.id === userId;
  const esMedico   = cita.medico?.usuario?.id   === userId;

  return esPaciente || esMedico;
}
}