export class ProductError extends Error {
  constructor(public code: string, message: string, public metadata?: any) {
    super(message);
  }
}

export class ProductNotFoundError extends ProductError {
  constructor(productId: string) {
    super('PRODUCT_NOT_FOUND', `Product with ID ${productId} not found.`, {
      productId,
    });
  }
}

export class ProductCreationError extends ProductError {
  constructor(reason: string, metadata?: any) {
    super(
      'PRODUCT_CREATION_FAILED',
      `Failed to create product: ${reason}`,
      metadata
    );
  }
}

export class InvalidInputError extends ProductError {
  constructor(reason: string, metadata?: any) {
    super('INVALID_INPUT', `Invalid input: ${reason}`, metadata);
  }
}
