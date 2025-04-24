import { AccountRole } from './auth';
import { Node } from './node';

export type User = Node & {
  username: string;
  password: string;
  role: AccountRole;
  firstname: string;
  lastname: string;
  email: string;
};
