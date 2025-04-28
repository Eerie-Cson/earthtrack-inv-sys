import { faker } from '@faker-js/faker';
import { Category } from '../types';
export function generateUser(params?: Record<string, any>) {
  return {
    id: generateId('acc'),
    username: params?.username || faker.internet.displayName(),
    role: params?.role || 'user',
    email: params?.email || faker.internet.email(),
    firstname: params?.firstName || faker.person.firstName(),
    lastname: params?.lastName || faker.person.lastName(),
  };
}

export function generateCredentials(params?: Record<string, any>) {
  return {
    username: params?.username || faker.internet.displayName(),
    password: params?.password || faker.internet.password(),
  };
}

export function generateProduct(params?: Record<string, any>) {
  return {
    id: generateId('pro'),
    name: params?.name || faker.commerce.productName(),
    description: params?.description || faker.commerce.productDescription(),
    price: params?.price || Number(faker.commerce.price()),
    category:
      params?.category || faker.helpers.arrayElement(Object.values(Category)),
  };
}

export function generateId(prefix?: string) {
  const uuid = faker.string.uuid().split('-').join('');
  return prefix ? `${prefix}_${uuid}` : `pro_${uuid}`;
}
