import { UserCoupon } from './user-coupon.entity';
import { UserCouponService } from './user-coupon.service';
import {
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../../commons/enum/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('UserCoupon')
@ApiBearerAuth()
@Controller('')
export class UserCouponController {
    constructor(private readonly userCouponService: UserCouponService) {}

    @Post('user/user-coupons/:couponId')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'couponId',
        format: 'uuid',
        type: 'string',
    })
    @UseInterceptors(ClassSerializerInterceptor)
    saveCoupon(@Request() req, @Param('couponId', ParseUUIDPipe) couponId: string) {
        return this.userCouponService.saveCoupon(req.userId, couponId);
    }

    @Get('/user/user-coupons')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    getAllUserCoupon(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
        @Request() req,
    ): Promise<Pagination<UserCoupon>> {
        limit = limit > 100 ? 100 : limit;
        return this.userCouponService.getAllUserCoupon(
            {
                page,
                limit,
                route: 'http://localhost:3000/coupons',
            },
            req.userId,
        );
    }
}
