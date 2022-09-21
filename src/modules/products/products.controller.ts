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
    ClassSerializerInterceptor,
    ParseUUIDPipe,
} from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../../commons/enum/roles.enum';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductStatus } from '../../commons/enum/products.enum';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Delete } from '@nestjs/common/decorators';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get('/admin/products/:productId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'productId',
        format: 'uuid',
        type: 'string',
    })
    getProductByIdForAdmin(@Param('productId', ParseUUIDPipe) productId: string, @Request() req) {
        return this.productService.getProductById(productId, req.userRole);
    }

    @Get('/user/products/:productId')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiParam({
        name: 'productId',
        format: 'uuid',
        type: 'string',
    })
    getProductByIdForUser(@Param('productId', ParseUUIDPipe) productId: string, @Request() req) {
        return this.productService.getProductById(productId, req.userRole);
    }

    @Get('/admin/products/categoryId/:categoryId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'categoryId',
        format: 'uuid',
        type: 'string',
    })
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProductByCategoryForAdmin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Request() req,
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getAllProductByCategory(
            {
                page,
                limit,
                route: 'http://localhost:3000/products/:categoryId',
            },
            categoryId,
            req.userRole as Role,
        );
    }

    @Get('/user/products/categoryId/:categoryId')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiParam({
        name: 'categoryId',
        format: 'uuid',
        type: 'string',
    })
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProductByCategoryForUser(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Request() req,
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getAllProductByCategory(
            {
                page,
                limit,
                route: 'http://localhost:3000/products/:categoryId',
            },
            categoryId,
            req.userRole as Role,
        );
    }

    @Get('/admin/products')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProductForAdmin(
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

    @Get('/user/products')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllProductForUser(
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
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiParam({
        name: 'productId',
        format: 'uuid',
        type: 'string',
    })
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getImageProduct(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Param('productId', ParseUUIDPipe) productId: string,
    ): Promise<Pagination<Picture>> {
        limit = limit > 100 ? 100 : limit;
        return this.productService.getImageProduct(
            {
                page,
                limit,
                route: 'http://localhost:3000/products/images/:productId',
            },
            productId,
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
        format: 'uuid',
        type: 'string',
    })
    updateProduct(@Body() product: UpdateProductDto, @Param('id', ParseUUIDPipe) id: string): Promise<Product> {
        return this.productService.updateProduct(id, product);
    }

    @Delete('/admin/products/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
        format: 'uuid',
        type: 'string',
    })
    deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.changeProductStatus(id, ProductStatus.unavailable);
    }
}
