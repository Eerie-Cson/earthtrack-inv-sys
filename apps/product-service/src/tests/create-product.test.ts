import { AccountRole, Category } from '@lib/types';
import { JwtService } from '@nestjs/jwt';
import * as R from 'ramda';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { generateAccount } from './helpers/generate-account';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.CreateProduct', () => {
  test.concurrent(
    'should create a new product given role is admin',
    async () => {
      const { request, module, teardown } = await setupFixture();

      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      const account = generateAccount(AccountRole.Admin);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(R.omit(['id'], product))
        .expect(201);

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
    }
  );
  test.concurrent(
    'should create a new product given role is auditor',
    async () => {
      const { request, module, teardown } = await setupFixture();

      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      const account = generateAccount(AccountRole.Auditor);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(R.omit(['id'], product))
        .expect(201);

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
    }
  );
  test.concurrent(
    'should create a new product given role is user',
    async () => {
      const { request, module, teardown } = await setupFixture();

      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      const account = generateAccount(AccountRole.User);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(R.omit(['id'], product))
        .expect(201);

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
    }
  );
  test.concurrent(
    'should return 400 if required fields are missing',
    async () => {
      const { request, teardown, module } = await setupFixture();

      const account = generateAccount(AccountRole.User);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 299,
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);

      await teardown();
    }
  );
});
