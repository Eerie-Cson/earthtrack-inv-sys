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
import { AccountRole, Category } from '@lib/types';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductListQueryDto } from './dto/product-list-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBody({ type: CreateProductDto })
  async createProduct(@Body() dto: CreateProductDto) {
    await this.productService.createProduct({
      id: ObjectId.generate(ObjectType.PRODUCT),
      ...dto,
    });
    return { data: { createProduct: true } };
  }

  @Put(':id')
  @ApiBody({ type: UpdateProductDto })
  @Roles(AccountRole.Auditor, AccountRole.Admin)
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    await this.productService.updateProduct(ObjectId.from(id), dto);
    return { data: { updateProduct: true } };
  }

  @Delete(':id')
  @Roles(AccountRole.Admin)
  @ApiParam({ name: 'id', type: String })
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(ObjectId.from(id));
    return { data: { deleteProduct: true } };
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.findProduct(ObjectId.from(id));
    return { data: product };
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max number of items to return',
    example: 10,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Pagination cursor',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'asc',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, enum: Category })
  async getPaginatedProducts(@Query() params: ProductListQueryDto) {
    return this.productService.listProducts({
      limit: params.limit,
      cursor: params.cursor,
      sort: params.sort,
      filter: {
        name: params.name,
        description: params.description,
        category: params.category,
      },
    });
  }
}
