import { jwtModule } from './../jwts/jwts.module';
import { ProductRepository } from './products.repository';
import { CategoryModule } from './../categorys/categorys.module';
import { Product } from './products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { cacheModule } from '../cache/cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoryModule, jwtModule, cacheModule],
    controllers: [ProductsController],
    providers: [ProductsService, ProductRepository],
    exports: [ProductsService],
})
export class ProductsModule {}
