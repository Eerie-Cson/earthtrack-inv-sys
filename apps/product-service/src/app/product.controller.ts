import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

import { JwtAuthGuard, Roles, RolesGuard } from '@lib/auth';
import { ObjectId, ObjectType } from '@lib/object-id';
import { AccountRole } from '@lib/types';
import { ProductListQueryDto } from './dto/product-list-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    await this.productService.createProduct({
      id: ObjectId.generate(ObjectType.PRODUCT),
      ...dto,
    });
    return { data: { createProduct: true } };
  }

  @Roles(AccountRole.Auditor, AccountRole.Admin)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    await this.productService.updateProduct(ObjectId.from(id), dto);
    return { data: { updateProduct: true } };
  }

  @Roles(AccountRole.Admin)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(ObjectId.from(id));
    return { data: { deleteProduct: true } };
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.findProduct(ObjectId.from(id));
    return { data: product };
  }

  @Get()
  async getPaginatedProducts(@Query() params: ProductListQueryDto) {
    return this.productService.listProducts({
      limit: params.limit,
      cursor: params.cursor,
      sort: params.sort,
      filter: {
        name: params.name,
        description: params.description,
      },
    });
  }
}
