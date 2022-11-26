import { ApiProperty } from '@nestjs/swagger';

export class S3UrlResponse {
  @ApiProperty()
  upload: string;

  @ApiProperty()
  download: string;
}
