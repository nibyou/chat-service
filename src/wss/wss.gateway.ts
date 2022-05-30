import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { WssService } from './wss.service';
import { CreateWssDto } from './dto/create-wss.dto';
import { UpdateWssDto } from './dto/update-wss.dto';

@WebSocketGateway()
export class WssGateway {
  constructor(private readonly wssService: WssService) {}

  @SubscribeMessage('createWss')
  create(@MessageBody() createWssDto: CreateWssDto) {
    return this.wssService.create(createWssDto);
  }

  @SubscribeMessage('findAllWss')
  findAll() {
    return this.wssService.findAll();
  }

  @SubscribeMessage('findOneWss')
  findOne(@MessageBody() id: number) {
    return this.wssService.findOne(id);
  }

  @SubscribeMessage('updateWss')
  update(@MessageBody() updateWssDto: UpdateWssDto) {
    return this.wssService.update(updateWssDto.id, updateWssDto);
  }

  @SubscribeMessage('removeWss')
  remove(@MessageBody() id: number) {
    return this.wssService.remove(id);
  }
}
