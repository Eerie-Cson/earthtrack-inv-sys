import { ObjectId, ObjectType } from '@lib/object-id';
import { AccountRole } from '@lib/types';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { ProductNotFoundError } from '../error';
import { generateAccount } from './helpers/generate-account';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.DeleteProduct', () => {
  test.concurrent('should delete a product given role is admin', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const { data: product } = generateProduct();
    await productRepository.create(product);

    const account = generateAccount(AccountRole.Admin);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const response = await request
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    const deletedProduct = await productRepository.find(product.id);

    expect(response.status).toBe(200);
    expect(response.body.data.deleteProduct).toBe(true);
    expect(deletedProduct).toBeNull();

    await teardown();
  });
  test.concurrent(
    'should not delete a product given role is auditor',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      await productRepository.create(product);

      const account = generateAccount(AccountRole.Auditor);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);

      const deletedProduct = await productRepository.find(product.id);

      expect(response.status).toBe(403);
      expect(response.body.data).toBeUndefined();
      expect(response.body).toHaveProperty('error');
      expect(deletedProduct).not.toBeNull();

      await teardown();
    }
  );
  test.concurrent(
    'should not delete a product given role is user',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Token.ProductRepository
      );

      const { data: product } = generateProduct();
      await productRepository.create(product);

      const account = generateAccount(AccountRole.User);

      const jwtService = module.get<JwtService>(JwtService);

      const token = jwtService.sign({
        sub: account.id,
        username: account.username,
        role: account.role,
      });

      const response = await request
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);

      const deletedProduct = await productRepository.find(product.id);

      await teardown();

      expect(response.status).toBe(403);
      expect(response.body.data).toBeUndefined();
      expect(response.body).toHaveProperty('error');
      expect(deletedProduct).not.toBeNull();
    }
  );

  test.concurrent('should throw error given no product found', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const { data: product } = generateProduct();
    await productRepository.create(product);

    const account = generateAccount(AccountRole.Admin);

    const jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: account.id,
      username: account.username,
      role: account.role,
    });

    const nonExistentId = ObjectId.generate(ObjectType.PRODUCT).toString();
    const expectedError = new ProductNotFoundError(nonExistentId);

    const response = await request
      .delete(`/api/products/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(expectedError.code);
    expect(response.body.message).toBe(expectedError.message);
    expect(response.body.metadata).toEqual(expectedError.metadata);

    await teardown();
  });
});
