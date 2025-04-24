import { Category } from '@lib/types';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsIn(Object.values(Category))
  category: Category;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
