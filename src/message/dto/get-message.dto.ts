import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({
    type: String,
    pattern: '^[a-f\\d]{24}$',
    description: 'MongoDB ObjectId of the last item of the previous page',
  })
  start?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ minimum: 0, description: 'Number of items to skip' })
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    description: 'Number of items to return',
  })
  limit?: number;
}
