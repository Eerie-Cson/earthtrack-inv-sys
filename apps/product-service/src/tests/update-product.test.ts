import { ObjectId, ObjectType } from '@lib/object-id';
import { AccountRole } from '@lib/types';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { ProductNotFoundError } from '../error';
import { generateAccount } from './helpers/generate-account';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.UpdateProduct', () => {
  test.concurrent(
    'should update an existing product given role is admin',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      await productRepository.create(product);

      const updatedData = {
        name: 'new Name',
        price: product.price + 10,
        description: 'Updated Description',
        category: product.category,
      };

      const account = generateAccount(AccountRole.Admin);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);

      const updatedProduct = await productRepository.find(product.id);

      await teardown();

      expect(response.body.data.updateProduct).toBe(true);
      expect(updatedProduct.name).toBe(updatedData.name);
      expect(updatedProduct.price).toBe(updatedData.price);
      expect(updatedProduct.description).toBe(updatedData.description);
    }
  );
  test.concurrent(
    'should update an existing product given role is auditor',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      await productRepository.create(product);

      const updatedData = {
        name: 'new Name',
        price: product.price + 10,
        description: 'Updated Description',
        category: product.category,
      };

      const account = generateAccount(AccountRole.Auditor);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);

      const updatedProduct = await productRepository.find(product.id);

      await teardown();

      expect(response.body.data.updateProduct).toBe(true);
      expect(updatedProduct.name).toBe(updatedData.name);
      expect(updatedProduct.price).toBe(updatedData.price);
      expect(updatedProduct.description).toBe(updatedData.description);
    }
  );
  test.concurrent(
    'should notupdate an existing product given role is user',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      await productRepository.create(product);

      const updatedData = {
        name: 'new Name',
        price: product.price + 10,
        description: 'Updated Description',
        category: product.category,
      };

      const account = generateAccount(AccountRole.User);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(403);

      const updatedProduct = await productRepository.find(product.id);

      await teardown();

      expect(response.status).toBe(403);
      expect(response.body.data).toBeUndefined();
      expect(response.body).toHaveProperty('error');

      expect(updatedProduct.name).not.toBe(updatedData.name);
      expect(updatedProduct.price).not.toBe(updatedData.price);
      expect(updatedProduct.description).not.toBe(updatedData.description);

      expect(updatedProduct).toMatchObject(product);
    }
  );

  test.concurrent('should throw an error given product not found', async () => {
    const { request, teardown, module } = await setupFixture();

    const nonExistentId = ObjectId.generate(ObjectType.PRODUCT).toString();
    const expectedError = new ProductNotFoundError(nonExistentId);

    const account = generateAccount(AccountRole.Admin);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const updateInput = {
      name: generateProduct().data.name,
      price: generateProduct().data.price,
    };

    const response = await request
      .put(`/api/products/${nonExistentId}`)
      .send(updateInput)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body.code).toBe(expectedError.code);
    expect(response.body.message).toBe(expectedError.message);
    expect(response.body.metadata).toEqual(expectedError.metadata);

    await teardown();
  });
});
