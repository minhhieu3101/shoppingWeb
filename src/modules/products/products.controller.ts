import { Picture } from './../pictures/pictures.entity';
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
    Query,
    DefaultValuePipe,
    ParseIntPipe,
} from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../../commons/enum/roles.enum';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductStatus } from '../../commons/enum/products.enum';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';

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
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProductByCategory(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Request() req,
        @Param() params,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getAllProductByCategory(
            {
                page,
                limit,
                route: 'http://localhost:3000/products/:categoryId',
            },
            params.categoryId,
            req.userRole as Role,
        );
    }

    @Get('/products')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Request() req,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getAllProduct(
            {
                page,
                limit,
                route: 'http://localhost:3000/products',
            },
            req.userRole as Role,
        );
    }

    @Get('/products/images/:productId')
    @Roles(Role.user, Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'productId',
    })
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getImageProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Param() params,
    ): Promise<Pagination<Picture>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getImageProduct(
            {
                page,
                limit,
                route: 'http://localhost:3000/products/images/:productId',
            },
            params.productId,
        );
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
