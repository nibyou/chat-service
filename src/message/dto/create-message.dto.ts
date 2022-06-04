import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  chat: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  sender?: string;
  @ApiProperty()
  attachments?: string[];
}
