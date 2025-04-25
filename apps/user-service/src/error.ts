import { status as GrpcStatus } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

export class UserError extends Error {
  public readonly code: string;
  public readonly httpStatus: HttpStatus;
  public readonly grpcStatus: GrpcStatus;
  public readonly metadata?: any;

  constructor(
    code: string,
    message: string,
    httpStatus: HttpStatus,
    grpcStatus: GrpcStatus,
    metadata?: any
  ) {
    super(message);
    this.name = 'UserError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.grpcStatus = grpcStatus;
    this.metadata = metadata;
  }
}

export class UserNotFoundError extends UserError {
  constructor(userId: string) {
    super(
      'USER_NOT_FOUND',
      `User with ID ${userId} does not exist.`,
      HttpStatus.NOT_FOUND,
      GrpcStatus.NOT_FOUND,
      { userId }
    );
  }
}

export class UserCreationError extends UserError {
  constructor(reason: string, metadata?: any) {
    super(
      'USER_CREATION_FAILED',
      `Failed to create user: ${reason}`,
      HttpStatus.BAD_REQUEST,
      GrpcStatus.INVALID_ARGUMENT,
      metadata
    );
  }
}

export class InvalidCredentialsError extends UserError {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
      GrpcStatus.UNAUTHENTICATED
    );
  }
}

export class DuplicateUsernameError extends UserError {
  constructor(username: string) {
    super(
      'DUPLICATE_USERNAME',
      `Username ${username} already exists`,
      HttpStatus.CONFLICT,
      GrpcStatus.ALREADY_EXISTS,
      { username }
    );
  }
}
