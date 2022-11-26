import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty()
  fileType: string;
  @ApiProperty()
  fileName?: string;
  @ApiProperty()
  rawData?: string;
  @ApiProperty()
  url?: string;
  @ApiProperty()
  chatId: string;
}
