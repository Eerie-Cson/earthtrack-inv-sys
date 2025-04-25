export enum AccountRole {
  Admin = 'admin',
  User = 'user',
  Auditor = 'auditor',
}

export type AccountPayload = {
  sub: string;
  username: string;
  role: string;
};
