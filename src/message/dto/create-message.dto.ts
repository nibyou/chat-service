import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAttachmentDto } from '../../attachment/dto/create-attachment.dto';

export class CreateMessageDto {
  @ApiProperty()
  chat: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  sender?: string;
  @ApiProperty({
    type: [OmitType(CreateAttachmentDto, ['chatId'])],
  })
  attachments?: Partial<CreateAttachmentDto>[];
}
