import { Tokens } from '../app/libs/tokens';
import { ProductRepository } from '../app/repository/product.repository';
import { generateProduct } from './helpers/generate-product';
import { setupFixture } from './helpers/setup-fixture';

describe('ProductController.GetPaginatedProducts', () => {
  test.concurrent('should paginate products correctly', async () => {
    const { request, module, teardown } = await setupFixture();
    const productRepository = module.get<ProductRepository>(
      Tokens.ProductRepository
    );

    const products = generateProduct().times(18);

    await Promise.all(
      products.map((product) => productRepository.create(product))
    );

    const baseQueryParams = {
      limit: '10',
      sort: 'asc',
    };

    const firstPageParams = new URLSearchParams(baseQueryParams);

    const firstPageResponse = await request.get(
      `/api/products?${firstPageParams.toString()}`
    );

    expect(firstPageResponse.status).toBe(200);
    expect(firstPageResponse.body).not.toHaveProperty('errors');
    expect(firstPageResponse.body.data).toHaveLength(10);
    expect(firstPageResponse.body.nextCursor).toBeDefined();

    const secondPageParams = new URLSearchParams({
      ...baseQueryParams,
      cursor: firstPageResponse.body.nextCursor,
    });

    const secondPageResponse = await request.get(
      `/api/products?${secondPageParams.toString()}`
    );

    expect(secondPageResponse.status).toBe(200);
    expect(secondPageResponse.body).not.toHaveProperty('errors');
    expect(secondPageResponse.body.data).toHaveLength(8);
    expect(secondPageResponse.body.nextCursor).toBeNull();

    await teardown();
  });
  test.concurrent(
    'should paginate products with partial name filter',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Tokens.ProductRepository
      );

      const partialName = 'product';

      const product1 = { ...generateProduct().data, name: 'product1' };
      const product2 = { ...generateProduct().data, name: 'product2' };
      const product3 = { ...generateProduct().data, name: 'product3' };
      const product4 = { ...generateProduct().data, name: 'product4' };
      const product5 = { ...generateProduct().data, name: 'product5' };
      const product6 = { ...generateProduct().data, name: 'product6' };
      const product7 = { ...generateProduct().data, name: 'product7' };
      const product8 = { ...generateProduct().data, name: 'product8' };
      const product9 = { ...generateProduct().data, name: 'product9' };
      const product10 = { ...generateProduct().data, name: 'product10' };

      const productsWithPartialName = [
        product1,
        product2,
        product3,
        product4,
        product5,
        product6,
        product7,
        product8,
        product9,
        product10,
      ];

      const otherProducts = generateProduct().times(20);

      const products = productsWithPartialName.concat(otherProducts);

      await Promise.all(
        products.map((product) => productRepository.create(product))
      );

      const baseQueryParams = {
        limit: '6',
        sort: 'asc',
        name: partialName,
      };

      const firstPageParams = new URLSearchParams(baseQueryParams);

      const firstPageResponse = await request.get(
        `/api/products?${firstPageParams.toString()}`
      );

      expect(firstPageResponse.status).toBe(200);
      expect(firstPageResponse.body).not.toHaveProperty('errors');
      expect(firstPageResponse.body.data).toHaveLength(6);
      expect(firstPageResponse.body.nextCursor).toBeDefined();

      firstPageResponse.body.data.forEach((product) => {
        expect(product.name.toLowerCase()).toContain(partialName.toLowerCase());
      });

      const secondPageParams = new URLSearchParams({
        ...baseQueryParams,
        cursor: firstPageResponse.body.nextCursor,
      });

      const secondPageResponse = await request.get(
        `/api/products?${secondPageParams.toString()}`
      );

      expect(secondPageResponse.status).toBe(200);
      expect(secondPageResponse.body).not.toHaveProperty('errors');
      expect(secondPageResponse.body.data).toHaveLength(4);
      expect(secondPageResponse.body.nextCursor).toBeNull();

      secondPageResponse.body.data.forEach((product) => {
        expect(product.name.toLowerCase()).toContain(partialName.toLowerCase());
      });

      await teardown();
    }
  );
  test.concurrent(
    'should paginate products with partial description filter',
    async () => {
      const { request, module, teardown } = await setupFixture();
      const productRepository = module.get<ProductRepository>(
        Tokens.ProductRepository
      );

      const partialDescription = 'special-';

      const product1 = {
        ...generateProduct().data,
        description: 'special-product1',
      };
      const product2 = {
        ...generateProduct().data,
        description: 'special-product2',
      };
      const product3 = {
        ...generateProduct().data,
        description: 'special-product3',
      };
      const product4 = {
        ...generateProduct().data,
        description: 'special-product4',
      };
      const product5 = {
        ...generateProduct().data,
        description: 'special-product5',
      };
      const product6 = {
        ...generateProduct().data,
        description: 'special-product6',
      };
      const product7 = {
        ...generateProduct().data,
        description: 'special-product7',
      };
      const product8 = {
        ...generateProduct().data,
        description: 'special-product8',
      };
      const product9 = {
        ...generateProduct().data,
        description: 'special-product9',
      };
      const product10 = {
        ...generateProduct().data,
        description: 'special-product10',
      };

      const productsWithPartialDescription = [
        product1,
        product2,
        product3,
        product4,
        product5,
        product6,
        product7,
        product8,
        product9,
        product10,
      ];

      const otherProducts = generateProduct().times(20);

      const products = productsWithPartialDescription.concat(otherProducts);

      await Promise.all(
        products.map((product) => productRepository.create(product))
      );

      const baseQueryParams = {
        limit: '6',
        sort: 'asc',
        description: partialDescription,
      };

      const firstPageParams = new URLSearchParams(baseQueryParams);

      const firstPageResponse = await request.get(
        `/api/products?${firstPageParams.toString()}`
      );

      expect(firstPageResponse.status).toBe(200);
      expect(firstPageResponse.body).not.toHaveProperty('errors');
      expect(firstPageResponse.body.data).toHaveLength(6);
      expect(firstPageResponse.body.nextCursor).toBeDefined();

      firstPageResponse.body.data.forEach((product) => {
        expect(product.description.toLowerCase()).toContain(
          partialDescription.toLowerCase()
        );
      });

      const secondPageParams = new URLSearchParams({
        ...baseQueryParams,
        cursor: firstPageResponse.body.nextCursor,
      });

      const secondPageResponse = await request.get(
        `/api/products?${secondPageParams.toString()}`
      );

      expect(secondPageResponse.status).toBe(200);
      expect(secondPageResponse.body).not.toHaveProperty('errors');
      expect(secondPageResponse.body.data).toHaveLength(4);
      expect(secondPageResponse.body.nextCursor).toBeNull();

      secondPageResponse.body.data.forEach((product) => {
        expect(product.description.toLowerCase()).toContain(
          partialDescription.toLowerCase()
        );
      });

      await teardown();
    }
  );
});
