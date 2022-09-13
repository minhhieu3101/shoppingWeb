import { Coupon } from './coupons.entity';
import { CouponsService } from './coupons.service';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    Request,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/commons/enum/roles.enum';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Coupon')
@ApiBearerAuth()
@Controller('')
export class CouponsController {
    constructor(private readonly couponService: CouponsService) {}

    @Post('admin/coupons')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    createCoupon(@Body() coupon: CreateCouponDto) {
        return this.couponService.createCoupon(coupon);
    }

    @Get('/admin/coupons')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllCouponForAdmin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    ): Promise<Pagination<Coupon>> {
        limit = limit > 100 ? 100 : limit;
        return this.couponService.getAllCoupon(
            {
                page,
                limit,
                route: 'http://localhost:3000/products',
            },
            Role.admin,
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
    ): Promise<Pagination<Coupon>> {
        limit = limit > 100 ? 100 : limit;
        return this.couponService.getAllCoupon(
            {
                page,
                limit,
                route: 'http://localhost:3000/products',
            },
            Role.user,
        );
    }

    @Get('/admin/coupons/:couponId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'couponId',
    })
    getCouponByIdForAdmin(@Param() params, @Request() req) {
        return this.couponService.getCouponById(params.couponId, req.userRole);
    }

    @Get('/user/coupons/:couponId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'couponId',
    })
    getCouponByIdForUser(@Param() params, @Request() req) {
        return this.couponService.getCouponById(params.couponId, req.userRole);
    }
}
