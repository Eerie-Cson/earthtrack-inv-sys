import { ObjectId } from '@lib/object-id';
import { PaginateOptions } from '@lib/paginate';
import { Category, Product } from '@lib/types';
import { normalizeDocument } from '@lib/util';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProductNotFoundError } from '../error';
import { Tokens } from './libs/tokens';
import { ProductRepository } from './repository/product.repository';

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

  async findProducts(params: FilterQuery<Product>) {
    const products = await this.productRepository.list(params);

    return products.map((product) => normalizeDocument(product));
  }

  async listProducts(params: {
    limit: number;
    rawCursor?: string;
    sort: 'asc' | 'desc';
    category?: Category;
    priceMin?: number;
    priceMax?: number;
  }) {
    const filter: FilterQuery<Product> = {};

    if (params.category) filter.category = params.category;
    if (params.priceMin || params.priceMax) {
      filter.price = {};
      if (params.priceMin) filter.price.$gte = params.priceMin;
      if (params.priceMax) filter.price.$lte = params.priceMax;
    }

    const options: PaginateOptions<Partial<Product>> = {
      limit: params.limit,
      sort: params.sort,
      cursor: params.rawCursor
        ? Buffer.from(params.rawCursor, 'base64')
        : undefined,
    };

    const result = await this.productRepository.paginateList(filter, options);

    return {
      data: result.data.map(normalizeDocument),
      nextCursor: result.nextCursor?.toString('base64') || null,
    };
  }
}
