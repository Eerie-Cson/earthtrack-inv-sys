import { ObjectId, ObjectType } from '@lib/object-id';
import { AccountRole } from '@lib/types';
import { JwtService } from '@nestjs/jwt';
import * as R from 'ramda';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { generateAccount } from './helpers/generate-account';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.GetProductById', () => {
  test.concurrent('should return the product given role is admin', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const products = generateProduct().times(3);
    const product = R.head(products);

    await Promise.all(
      products.map((product) => productRepository.create(product))
    );

    const account = generateAccount(AccountRole.Admin);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const response = await request
      .get(`/api/products/${product.id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

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

  test.concurrent(
    'should return the product given role is auditor',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const products = generateProduct().times(3);
      const product = R.head(products);

      await Promise.all(
        products.map((product) => productRepository.create(product))
      );

      const account = generateAccount(AccountRole.Auditor);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .get(`/api/products/${product.id.toString()}`)
        .set('Authorization', `Bearer ${token}`);

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
    }
  );

  test.concurrent('should return the product given role is user', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const products = generateProduct().times(3);
    const product = R.head(products);

    await Promise.all(
      products.map((product) => productRepository.create(product))
    );

    const account = generateAccount(AccountRole.User);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const response = await request
      .get(`/api/products/${product.id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

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

    const account = generateAccount(AccountRole.Admin);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const response = await request
      .get(`/api/products/${nonExistentId.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    await teardown();

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('errors');
    expect(response.body.data).toBeNull();

    await teardown();
  });
});
