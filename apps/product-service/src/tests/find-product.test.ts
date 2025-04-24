import { ObjectId, ObjectType } from '@lib/object-id';
import * as R from 'ramda';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.GetProductById', () => {
  test.concurrent('should return the product by ID', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const products = generateProduct().times(3);
    const product = R.head(products);

    await Promise.all(
      products.map((product) => productRepository.create(product))
    );

    const response = await request.get(
      `/api/products/${product.id.toString()}`
    );

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('errors');
    expect(response.body.data).toMatchObject({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    });

    await teardown();
  });

  test.concurrent('should return null given no product found', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const products = generateProduct().times(3);
    const nonExistentId = ObjectId.generate(ObjectType.PRODUCT);

    await Promise.all(
      products.map((product) => productRepository.create(product))
    );

    const response = await request.get(
      `/api/products/${nonExistentId.toString()}`
    );

    await teardown();

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('errors');
    expect(response.body.data).toBeNull();

    await teardown();
  });
});
