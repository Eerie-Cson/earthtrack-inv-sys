import { generateProduct } from '../tests/helpers/generate-product';
import { ProductService } from './product.service';

describe('ProductService', () => {
  const productRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    list: jest.fn(),
    paginateList: jest.fn(),
  };

  const productService = new ProductService(productRepository as never);

  describe('#createProduct', () => {
    test.concurrent('should call create with correct params', async () => {
      const { data: product } = generateProduct();

      await productService.createProduct(product);

      expect(productRepository.create).toHaveBeenCalledWith(product);
    });
  });

  describe('#updateProduct', () => {
    test.concurrent('should call update with correct params', async () => {
      const { data: product } = generateProduct();
      productRepository.find.mockResolvedValue(product);

      await productService.updateProduct(product.id, {
        name: product.name,
      });

      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        name: product.name,
      });
    });
  });

  describe('#deleteProduct', () => {
    test.concurrent('should call delete with correct params', async () => {
      const { data: product } = generateProduct();
      productRepository.find.mockResolvedValue(product);

      await productService.deleteProduct(product.id);

      expect(productRepository.delete).toHaveBeenCalledWith(product.id);
    });
  });

  describe('#findProduct', () => {
    test.concurrent('should call find with correct params ', async () => {
      const { data: product } = generateProduct();

      productRepository.find.mockResolvedValue(product);

      await productService.findProduct({ name: product.name });

      expect(productRepository.find).toHaveBeenCalledWith({
        name: product.name,
      });
    });
  });

  describe('#findProducts', () => {
    test.concurrent('should call list with the correct params', async () => {
      const { times: productTimes } = generateProduct();
      const products = productTimes(3);

      productRepository.list.mockResolvedValue(products);
      await productService.findProducts({});

      expect(productRepository.list).toHaveBeenCalledWith({});
    });
  });

  describe('#listProducts', () => {
    test.concurrent(
      'should call paginateList with the correct params',
      async () => {
        const { data: product } = generateProduct();
        const cursor = Buffer.from('next-cursor');
        const paginateResult = {
          data: [product],
          nextCursor: cursor,
        };

        productRepository.paginateList = jest
          .fn()
          .mockResolvedValue(paginateResult);

        await productService.listProducts({
          limit: 10,
          sort: 'asc',
          cursor: undefined,
          filter: {
            name: product.name,
          },
        });

        expect(productRepository.paginateList).toHaveBeenCalledWith(
          {
            name: {
              $options: 'i',
              $regex: product.name,
            },
          },
          {
            limit: 10,
            sort: 'asc',
            cursor: undefined,
          }
        );
      }
    );
  });
});
