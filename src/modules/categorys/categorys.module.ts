import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { cacheModule } from './../cache/cache.module';
import { jwtModule } from './../jwts/jwts.module';
import { CategoryRepository } from './categorys.repository';
import { Category } from './categorys.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './categorys.controller';
import { CategoryService } from './categorys.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), jwtModule, cacheModule, CloudinaryModule],
    providers: [CategoryService, CategoryRepository],
    controllers: [CategoryController],
    exports: [CategoryService],
})
export class CategoryModule {}
