import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  members: string[];
  @ApiProperty({ type: 'string', format: 'uuid' })
  admin?: string;
}
