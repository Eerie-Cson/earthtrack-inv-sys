import * as crypto from 'crypto';
import { ObjectType } from './object-type';

export default class ObjectId {
  private readonly value: string | Buffer;

  constructor(value?: Buffer) {
    this.value = value || crypto.randomBytes(8);
  }

  static generate(type: ObjectType) {
    return;
  }

  static from(value: string) {
    return;
  }

  toString() {
    return;
  }

  toBuffer() {
    return;
  }

  get type(): ObjectType {
    return this.value[0] as ObjectType;
  }
}
