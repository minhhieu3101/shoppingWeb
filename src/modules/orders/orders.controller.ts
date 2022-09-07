import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../../commons/enum/roles.enum';
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
    Delete,
    Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/createOrder.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Post('/orders')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBody({
        schema: {
            type: 'object',
            required: ['address', 'productArray'],
            properties: {
                address: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                productArray: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['productId', 'quantity'],
                        properties: {
                            productId: {
                                type: 'string',
                            },
                            quantity: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        },
    })
    createOrder(@Body() order: CreateOrderDto, @Request() req) {
        return this.orderService.createOrder(order, req.userId);
    }

    @Get('/orders')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getOrder(@Request() req) {
        return this.orderService.getYourOrder(req.userId);
    }

    @Get('admin/orders')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getAllOrder() {
        return this.orderService.getAllOrder();
    }

    @Delete('user/orders/orderProduct/:orderProductId')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiParam({ name: 'orderProductId' })
    deleteOrderProduct(@Param() params) {
        return this.orderService.deleteOrderProduct(params.orderProductId);
    }

    @Delete('user/orders/:orderId')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiParam({ name: 'orderId' })
    deleteOrder(@Param() params) {
        return this.orderService.deleteOrder(params.orderId);
    }
}
