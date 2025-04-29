import MockAdapter from 'axios-mock-adapter';
import { apiProductClient } from '../../api/axiosConfig';
import { getProductById, getProducts } from '../../api/product';
import { generateId, generateProduct } from '../generateData';

describe('Product API', () => {
  let mock: MockAdapter;

  const mockProduct = generateProduct();

  beforeEach(() => {
    mock = new MockAdapter(apiProductClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  test('getProducts returns list of products', async () => {
    const mockResponse = { data: [mockProduct] };
    mock.onGet('/products').reply(200, mockResponse);

    const response = await getProducts({ name: mockProduct.name, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
  });

  test('getProductById returns a product by ID', async () => {
    const mockResponse = { data: mockProduct };
    mock.onGet(`/products/${mockProduct.id}`).reply(200, mockResponse);

    const response = await getProductById(mockProduct.id);

    expect(response.status).toBe(200);
    expect(response.data.data).toMatchObject(mockProduct);
  });

  test('getProductById handles 404 error', async () => {
    mock.onGet('/products/nonexistent').reply(404, {
      message: 'Not Found',
    });

    try {
      await getProductById(generateId('pro'));
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toBeUndefined();
    }
  });
});
