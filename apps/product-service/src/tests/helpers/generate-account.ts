import { faker } from '@faker-js/faker/.';
import { ObjectId, ObjectType } from '@lib/object-id';
import { AccountRole } from '@lib/types';

export function generateAccount(role?: AccountRole) {
  const id = ObjectId.generate(ObjectType.ACCOUNT);
  return {
    id,
    username: faker.internet.username(),
    password: faker.internet.password(),
    role: role || faker.helpers.arrayElement(Object.values(AccountRole)),
    firstname: faker.person.firstName,
    lastname: faker.person.lastName(),
  };
}
