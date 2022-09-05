import { Product } from './products.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/commons/enum/roles.enum';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductStatus } from 'src/commons/enum/products.enum';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger/dist';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get('/products/:productId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'productId',
    })
    getProductById(@Param() params, @Request() req) {
        return this.productService.getProductById(params.productId, req.userRole);
    }

    @Get('/products/:categoryId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'categoryId',
    })
    getProductsByCategory(@Param() params, @Request() req) {
        return this.productService.getAllProductByCategory(params.categoryId, req.userRole);
    }

    @Get('/products')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    getProducts(@Request() req) {
        return this.productService.getAllProduct(req.userRole);
    }

    @Get('/products/images/:productId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'productId',
    })
    getProductImages(@Param() params) {
        return this.productService.getAllImageProduct(params.productId);
    }

    @Post('/admin/products')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
    @ApiConsumes('multipart/form-data')
    createProduct(@Body() product: CreateProductDto, @UploadedFiles() files: { files: Express.Multer.File[] }) {
        return this.productService.createProduct(product, files.files);
    }

    @Patch('/admin/products/update/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    updateProduct(@Body() product: UpdateProductDto, @Param() params): Promise<Product> {
        return this.productService.updateProduct(params.id, product);
    }

    @Patch('/admin/products/inactive/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    inactiveProduct(@Param() params) {
        return this.productService.changeProductStatus(params.id, ProductStatus.unavailable);
    }

    @Patch('/admin/products/active/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    activeProduct(@Param() params) {
        return this.productService.changeProductStatus(params.id, ProductStatus.active);
    }
}
