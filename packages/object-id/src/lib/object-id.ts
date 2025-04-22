import bs58 from 'bs58';
import * as crypto from 'crypto';
import { ObjectType } from './object-type';

const Prefix: Partial<{ [key in ObjectType]: string }> = {
  [ObjectType.ACCOUNT]: 'acc',
  [ObjectType.PRODUCT]: 'pro',
};

export class ObjectId {
  private readonly value: string | Buffer;

  constructor(value?: Buffer) {
    this.value = value || crypto.randomBytes(8);
  }

  static generate(type: ObjectType): ObjectId {
    const buffer = Buffer.concat([Buffer.from([type]), crypto.randomBytes(15)]);
    return new ObjectId(buffer);
  }

  toString(): string {
    const buffer =
      typeof this.value === 'string'
        ? Buffer.from(bs58.decode(this.value))
        : this.value;

    const hex = buffer.toString('hex');
    return `${Prefix[this.type]}_${hex}`;
  }

  static from(value: string): ObjectId {
    const [, encoded] = value.split('_');
    return new ObjectId(Buffer.from(encoded, 'hex'));
  }

  toBuffer(): Buffer {
    return typeof this.value === 'string'
      ? Buffer.from(bs58.decode(this.value))
      : this.value;
  }

  get type(): ObjectType {
    return this.value[0] as ObjectType;
  }
}
