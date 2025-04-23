import { Category } from '@lib/types';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  category: Category;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
