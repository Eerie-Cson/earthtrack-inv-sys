import { ObjectId } from '@lib/object-id';
import { PaginateOptions } from '@lib/paginate';
import { Product } from '@lib/types';
import { normalizeDocument } from '@lib/util';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProductNotFoundError } from '../error';
import { Token } from './libs/tokens';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(Token.ProductRepository)
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

  async findProducts(params: FilterQuery<Product>) {
    const products = await this.productRepository.list(params);

    return products.map((product) => normalizeDocument(product));
  }

  async listProducts(params: {
    limit: number;
    cursor?: string;
    sort: 'asc' | 'desc';
    filter: {
      name?: string;
      description?: string;
    };
  }) {
    const filter: FilterQuery<Product> = {};

    if (params.filter.name) {
      filter.name = { $regex: params.filter.name, $options: 'i' };
    }

    if (params.filter.description) {
      filter.description = { $regex: params.filter.description, $options: 'i' };
    }

    const options: PaginateOptions<Partial<Product>> = {
      limit: params.limit,
      sort: params.sort,
      cursor: params.cursor ? Buffer.from(params.cursor, 'base64') : undefined,
    };

    const result = await this.productRepository.paginateList(filter, options);

    return {
      data: result.data.map(normalizeDocument),
      nextCursor: result.nextCursor?.toString('base64') || null,
    };
  }
}
