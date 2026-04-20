import { Injectable } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaStatusDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  create(createCitaDto: CreateCitaDto) {
    return 'This action adds a new cita';
  }

  findAll() {
    return `This action returns all citas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cita`;
  }

  update(id: number, updateCitaStatusDto: UpdateCitaStatusDto) {
    return `This action updates a #${id} cita`;
  }

  remove(id: number) {
    return `This action removes a #${id} cita`;
  }
}
