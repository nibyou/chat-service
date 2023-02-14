import { ApiProperty } from '@nestjs/swagger';
import { MemberPermission } from '../schemata/chat.schema';

export class CreateChatDto {
  @ApiProperty()
  name?: string;
  @ApiProperty({
    type: () => [String],
  })
  members: string[];
  @ApiProperty({ type: 'string', format: 'uuid' })
  admin?: string;
  @ApiProperty({
    type: () => [MemberPermission],
  })
  memberPermissions: MemberPermission[];
}
