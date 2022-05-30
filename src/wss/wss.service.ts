import { Injectable } from '@nestjs/common';
import { CreateWssDto } from './dto/create-wss.dto';
import { UpdateWssDto } from './dto/update-wss.dto';

@Injectable()
export class WssService {
  create(createWssDto: CreateWssDto) {
    return 'This action adds a new wss';
  }

  findAll() {
    return `This action returns all wss`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wss`;
  }

  update(id: number, updateWssDto: UpdateWssDto) {
    return `This action updates a #${id} wss`;
  }

  remove(id: number) {
    return `This action removes a #${id} wss`;
  }
}
