import { OrderProductRepository } from './order-product.repository';
import { OrderProduct } from './order-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './../products/products.module';
import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';

@Module({
    imports: [ProductsModule, TypeOrmModule.forFeature([OrderProduct])],
    providers: [OrderProductService, OrderProductRepository],
    exports: [OrderProductService],
})
export class OrderProductModule {}
