import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Token } from './libs/tokens';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepositoryFactory } from './repository/product.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('PRODUCT_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: Token.ProductRepository,
      useFactory: ProductRepositoryFactory,
      inject: [getConnectionToken()],
    },
    ProductService,
  ],
})
export class ProductModule {}
