import { ObjectId, ObjectType } from '@lib/object-id';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { ProductNotFoundError } from '../error';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.DeleteProduct', () => {
  test.concurrent('should delete a product by ID', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const { data: product } = generateProduct();
    await productRepository.create(product);

    const response = await request.delete(`/api/products/${product.id}`);

    const deletedProduct = await productRepository.find(product.id);

    expect(response.body.data.deleteProduct).toBe(true);
    expect(deletedProduct).toBeNull();

    await teardown();
  });

  test.concurrent('should throw error given no product found', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Token.ProductRepository
    );

    const { data: product } = generateProduct();
    await productRepository.create(product);

    const nonExistentId = ObjectId.generate(ObjectType.PRODUCT).toString();
    const expectedError = new ProductNotFoundError(nonExistentId);

    const response = await request.delete(`/api/products/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(expectedError.code);
    expect(response.body.message).toBe(expectedError.message);
    expect(response.body.metadata).toEqual(expectedError.metadata);

    await teardown();
  });
});
