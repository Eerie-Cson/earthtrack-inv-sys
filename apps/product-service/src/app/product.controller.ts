import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
// import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { AccountRole } from '../roles/roles.enum';
import { ObjectId, ObjectType } from '@lib/object-id';
import { generate } from 'rxjs';

@Controller('products')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  // @Roles(AccountRole.Admin, AccountRole.Auditor)
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct({
      id: ObjectId.generate(ObjectType.PRODUCT),
      ...dto,
    });
  }

  @Put(':id')
  // @Roles(AccountRole.Auditor)
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(ObjectId.from(id), dto);
  }

  @Delete(':id')
  // @Roles(AccountRole.Admin)
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
