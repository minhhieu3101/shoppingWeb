import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/commons/enum/roles.enum';
import { OrdersService } from './orders.service';
import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    Get,
} from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Post('')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    createOrder(@Body() order, @Request() req) {
        order.userId = req.userId;
        return this.orderService.createOrder(order);
    }

    @Get('')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getOrder(@Request() req) {
        return this.orderService.getYourOrder(req.userId);
    }

    @Get('admin')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getAllOrder() {
        return this.orderService.getAllOrder();
    }
}
