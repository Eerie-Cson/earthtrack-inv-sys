import { Tokens } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { setupFixture } from './helpers/setup-fixture';
import { generateProduct } from './helpers/generate-product';
import * as R from 'ramda';
import { Category } from '@lib/types';

describe('ProductController.CreateProduct', () => {
  test.concurrent('should create a new product', async () => {
    const { request, module, teardown } = await setupFixture();

    const productRepository = module.get<ProductRepository>(
      Tokens.ProductRepository
    );

    const { data: product } = generateProduct();

    const response = await request
      .post('/api/products')
      .send(R.omit(['id'], product));

    const createdProduct = await productRepository.find({
      name: product.name,
    });

    await teardown();

    expect(createdProduct).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('errors');
    expect(response.body.data.createProduct).toBeTruthy();
    expect(createdProduct).toMatchObject({
      name: product.name,
      category: Category[product.category],
      price: product.price,
      description: product.description,
    });

    await teardown();
  });

  test.concurrent(
    'should return 400 if required fields are missing',
    async () => {
      const { request, teardown } = await setupFixture();

      const response = await request.post('/api/products').send({
        price: 299,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);

      await teardown();
    }
  );
});
