import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResponse, paginate } from '@lib/paginate';
import { ProductRepository } from './repository/product.repository';
import { Product } from '@lib/types';
import { Tokens } from './libs/tokens';
import { ObjectId } from '@lib/object-id';
import { FilterQuery } from 'mongoose';
import { normalizeDocument } from '@lib/util';
import { ProductError, ProductNotFoundError } from '../error';

@Injectable()
export class ProductService {
  constructor(
    @Inject(Tokens.ProductRepository)
    private readonly productRepository: ProductRepository
  ) {}

  async createProduct(params: Product) {
    return this.productRepository.create(params);
  }

  async updateProduct(id: ObjectId, dto: Partial<Omit<Product, 'id'>>) {
    const existingProduct = await this.findProduct(id);

    if (!existingProduct) {
      throw new ProductNotFoundError(id.toString());
    }
    return this.productRepository.update(id, dto);
  }

  async deleteProduct(id: ObjectId) {
    const existingProduct = await this.findProduct(id);

    if (!existingProduct) {
      throw new ProductNotFoundError(id.toString());
    }

    return this.productRepository.delete(id);
  }

  async findProduct(params: FilterQuery<Product>) {
    const product = await this.productRepository.find(params);
    if (!product) return null;

    return normalizeDocument(product);
  }

  async listProducts(params: FilterQuery<Product>) {
    const products = await this.productRepository.list(params);

    return products.map((product) => normalizeDocument(product));
  }
}
