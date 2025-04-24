import { ObjectId, ObjectType } from '@lib/object-id';
import { Token } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { ProductNotFoundError } from '../error';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.UpdateProduct', () => {
  test.concurrent('should update an existing product', async () => {
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

    const response = await request
      .put(`/api/products/${product.id}`)
      .send(updatedData);

    const updatedProduct = await productRepository.find(product.id);

    expect(response.body.data.updateProduct).toBe(true);
    expect(updatedProduct.name).toBe(updatedData.name);
    expect(updatedProduct.price).toBe(updatedData.price);
    expect(updatedProduct.description).toBe(updatedData.description);

    await teardown();
  });

  test.concurrent('should throw an error given product not found', async () => {
    const { request, teardown } = await setupFixture();

    const nonExistentId = ObjectId.generate(ObjectType.PRODUCT).toString();
    const expectedError = new ProductNotFoundError(nonExistentId);

    const updateInput = {
      name: generateProduct().data.name,
      price: generateProduct().data.price,
    };

    const response = await request
      .put(`/api/products/${nonExistentId}`)
      .send(updateInput);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(expectedError.code);
    expect(response.body.message).toBe(expectedError.message);
    expect(response.body.metadata).toEqual(expectedError.metadata);

    await teardown();
  });
});
