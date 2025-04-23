import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Tokens } from './libs/tokens';
import { ProductRepositoryFactory } from './repository/product.repository';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
      provide: Tokens.ProductRepository,
      useFactory: ProductRepositoryFactory,
      inject: [getConnectionToken()],
    },
    ProductService,
  ],
})
export class ProductModule {}
