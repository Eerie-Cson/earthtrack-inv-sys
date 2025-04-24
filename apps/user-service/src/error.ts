import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountError extends HttpException {
  public readonly code: string;
  public readonly metadata?: any;

  constructor(
    code: string,
    message: string,
    status: HttpStatus,
    metadata?: any
  ) {
    super(
      {
        code,
        message,
        metadata,
      },
      status
    );

    this.code = code;
    this.metadata = metadata;
  }
}

export class AccountNotFoundError extends AccountError {
  constructor(accountId: string) {
    super(
      'ACCOUNT_NOT_FOUND',
      `Account ${accountId} does not exist.`,
      HttpStatus.NOT_FOUND,
      { accountId }
    );
  }
}

export class AccountCreationError extends AccountError {
  constructor(reason: string, metadata?: any) {
    super(
      'ACCOUNT_CREATION_FAILED',
      `Failed to create product: ${reason}`,
      HttpStatus.BAD_REQUEST,
      metadata
    );
  }
}

export class InvalidInputError extends AccountError {
  constructor(reason: string, metadata?: any) {
    super(
      'INVALID_INPUT',
      `Invalid input: ${reason}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
      metadata
    );
  }
}
