import { Category } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ProductListQueryDto {
  @ApiProperty({ name: 'limit', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    name: 'cursor',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({ name: 'SortFilter', default: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc' = 'asc';

  @ApiProperty({ name: 'NameFilter' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ name: 'DescriptionFilter' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ name: 'CategoryFilter' })
  @ApiProperty({ enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
