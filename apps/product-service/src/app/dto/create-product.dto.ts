import { Category } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Category })
  @IsNotEmpty()
  @IsIn(Object.values(Category))
  category: Category;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
