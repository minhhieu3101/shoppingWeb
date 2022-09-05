import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryService } from './categorys.service';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Patch,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Category } from './categorys.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Role } from 'src/commons/enum/roles.enum';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common/decorators';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('/user/category')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getAllCategoryForUser(): Promise<Category[]> {
        return this.categoryService.getAllCategory({ status: CategoryStatus.active });
    }

    @Get('/user/category/:id')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getCategoryForUser(@Param() params): Promise<Category> {
        return this.categoryService.getCategory({ id: params.id, status: CategoryStatus.active });
    }

    @Get('/admin/category')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    getAllCategoryForAdmin(): Promise<Category[]> {
        return this.categoryService.getAllCategory({});
    }

    @Get('/admin/category/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    getCategoryForAdmin(@Param() params): Promise<Category> {
        return this.categoryService.getCategory({ id: params.id });
    }

    @Post('/admin/category')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('banner'))
    @ApiConsumes('multipart/form-data')
    createCategory(
        @Body() category: CreateCategoryDto,
        @UploadedFile() upload: Express.Multer.File,
    ): Promise<Category> {
        return this.categoryService.createCategory(category, upload);
    }

    @Patch('/admin/category/update/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    updateCategory(@Body() category: UpdateCategoryDto, @Param() params): Promise<Category> {
        return this.categoryService.updateCategory(params.id, category);
    }

    @Patch('/admin/category/inactive/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    inactiveCategory(@Param() params): Promise<Category> {
        return this.categoryService.changeCategoryStatus(params.id, CategoryStatus.inactive);
    }

    @Patch('/admin/category/active/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    activeCategory(@Param() params): Promise<Category> {
        return this.categoryService.changeCategoryStatus(params.id, CategoryStatus.active);
    }
}
