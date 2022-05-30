import { PartialType } from '@nestjs/mapped-types';
import { CreateWssDto } from './create-wss.dto';

export class UpdateWssDto extends PartialType(CreateWssDto) {
  id: number;
}
