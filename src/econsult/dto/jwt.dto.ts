import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty()
  jwt: string;
}

export class GuestMeetingDto {
  @ApiProperty()
  roomName: string;
  @ApiPropertyOptional()
  username?: string;
  @ApiProperty()
  email: string;
}

export class ModMeetingDto {
  @ApiProperty()
  roomName: string;
}
