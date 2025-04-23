import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductError extends HttpException {
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

export class ProductNotFoundError extends ProductError {
  constructor(productId: string) {
    super(
      'PRODUCT_NOT_FOUND',
      `Product with ID ${productId} does not exist.`,
      HttpStatus.NOT_FOUND,
      { productId }
    );
  }
}

export class ProductCreationError extends ProductError {
  constructor(reason: string, metadata?: any) {
    super(
      'PRODUCT_CREATION_FAILED',
      `Failed to create product: ${reason}`,
      HttpStatus.BAD_REQUEST,
      metadata
    );
  }
}

export class InvalidInputError extends ProductError {
  constructor(reason: string, metadata?: any) {
    super(
      'INVALID_INPUT',
      `Invalid input: ${reason}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
      metadata
    );
  }
}
