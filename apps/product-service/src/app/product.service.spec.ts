import { ProductService } from './product.service';
import { generateProduct } from '../tests/helpers/generate-product';

describe('ProductService', () => {
  const productRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    list: jest.fn(),
  };

  const productService = new ProductService(productRepository as never);

  describe('#createProduct', () => {
    test.concurrent('should create a new product', async () => {
      const { data: product } = generateProduct();

      await productService.createProduct(product);

      expect(productRepository.create).toHaveBeenCalledWith(product);
    });
  });

  describe('#updateProduct', () => {
    test.concurrent('should update a product', async () => {
      const { data: product } = generateProduct();

      await productService.updateProduct(product.id, {
        name: product.name,
      });

      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        name: product.name,
      });
    });
  });

  describe('#deleteProduct', () => {
    test.concurrent('should delete a product', async () => {
      const { data: product } = generateProduct();

      await productService.deleteProduct(product.id);

      expect(productRepository.delete).toHaveBeenCalledWith(product.id);
    });
  });

  describe('#findProduct', () => {
    test.concurrent('should find a product', async () => {
      const { data: product } = generateProduct();

      productRepository.find.mockResolvedValue(product);

      await productService.findProduct({ name: product.name });

      expect(productRepository.find).toHaveBeenCalledWith({
        name: product.name,
      });
    });
  });

  describe('#listProducts', () => {
    test.concurrent('should list products', async () => {
      const { times: productTimes } = generateProduct();
      const products = productTimes(3);

      productRepository.list.mockResolvedValue(products);
      await productService.listProducts({});

      expect(productRepository.list).toHaveBeenCalledWith({});
    });
  });
});
