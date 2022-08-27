import { Product } from './products.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/commons/enum/roles.enum';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductStatus } from 'src/commons/enum/products.enum';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get('/:productId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    getProductById(@Param() params, @Request() req) {
        return this.productService.getProductById(params.productId, req.userRole);
    }

    @Get('/:categoryId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    getProductsByCategory(@Param() params, @Request() req) {
        return this.productService.getAllProductByCategory(params.categoryId, req.userRole);
    }

    @Get('')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    getProducts(@Request() req) {
        return this.productService.getAllProduct(req.userRole);
    }

    @Post('/admin/:categoryId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    createProduct(@Body() product: CreateProductDto, @Param() params) {
        console.log(typeof product.weight);
        console.log(params.categoryId);
        return this.productService.createProduct(params.categoryId, product);
    }

    @Patch('/admin/update/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    updateProduct(@Body() product: UpdateProductDto, @Param() params): Promise<Product> {
        return this.productService.updateProduct(params.id, product);
    }

    @Patch('/admin/inactive/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    inactiveCategory(@Param() params) {
        return this.productService.changeProductStatus(params.id, ProductStatus.unavailable);
    }

    @Patch('/admin/active/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    activeCategory(@Param() params) {
        return this.productService.changeProductStatus(params.id, ProductStatus.active);
    }
}
