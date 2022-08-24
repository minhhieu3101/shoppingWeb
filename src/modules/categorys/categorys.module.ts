import { Category } from './categorys.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './categorys.controller';
import { CategoryService } from './categorys.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [CategoryService],
})
export class CategoryModule {}
