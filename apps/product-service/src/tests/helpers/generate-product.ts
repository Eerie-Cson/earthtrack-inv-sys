import { faker } from '@faker-js/faker';
import { ObjectId, ObjectType } from '@lib/object-id';
import { Category, Product } from '@lib/types';
import * as R from 'ramda';

export function generateProduct() {
  const product = () => ({
    id: ObjectId.generate(ObjectType.PRODUCT),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    category: faker.helpers.arrayElement(Object.values(Category)),
  });
  return {
    data: product() as Product,
    times: R.times(product),
  };
}
