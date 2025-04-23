import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';

import { ObjectId, ObjectType } from '@lib/object-id';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    await this.productService.createProduct({
      id: ObjectId.generate(ObjectType.PRODUCT),
      ...dto,
    });
    return { success: true };
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(ObjectId.from(id), dto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(ObjectId.from(id));
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.findProduct(ObjectId.from(id));
  }

  @Get()
  async listProducts() {
    return this.productService.listProducts({});
  }
}
