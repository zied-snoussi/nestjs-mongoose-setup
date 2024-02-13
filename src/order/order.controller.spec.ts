import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/Order.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schema/Order.schema';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forFeature([{ // Import the MongooseModule with the Order schema.
        name: Order.name,
        schema: OrderSchema,
    }])],
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      const mockCreatedOrder = {
        _id: 'test_order_id',
        ...createOrderDto,
      };
      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockCreatedOrder);
    });

    it('should throw an error if invalid data provided', async () => {
      const createOrderDto: CreateOrderDto = {
        user_id: '',
        product_id: '',
        quantity: '',
        status: '',
      };
      await expect(controller.createOrder(createOrderDto)).rejects.toThrow(
        new HttpException('Invalid data provided.', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          _id: 'test_order_id',
          user_id: 'test_user_id',
          product_id: 'test_product_id',
          quantity: '5',
          status: 'Pending',
        },
      ];
      const result = await controller.getAllOrders();

      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        _id: 'test_order_id',
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      const result = await controller.getOrder('test_order_id');

      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if order not found', async () => {
      jest.spyOn(orderService, 'getOrderById').mockResolvedValue(null);
      await expect(controller.getOrder('test_order_id')).rejects.toThrow(
        new HttpException('Order not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateOrder', () => {
    it('should update an order by id', async () => {
      const updateOrderDto: UpdateOrderDto = {
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      const mockUpdatedOrder = {
        _id: 'test_order_id',
        ...updateOrderDto,
      };
      const result = await controller.updateOrder('test_order_id', updateOrderDto);

      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should throw an error if order not found', async () => {
      const updateOrderDto: UpdateOrderDto = {
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      jest.spyOn(orderService, 'updateOrder').mockResolvedValue(null);
      await expect(controller.updateOrder('test_order_id', updateOrderDto)).rejects.toThrow(
        new HttpException('Order not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order by id', async () => {
      const mockOrder = {
        _id: 'test_order_id',
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      const result = await controller.deleteOrder('test_order_id');

      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if order not found', async () => {
      jest.spyOn(orderService, 'deleteOrder').mockResolvedValue(null);
      await expect(controller.deleteOrder('test_order_id')).rejects.toThrow(
        new HttpException('Order not found', HttpStatus.NOT_FOUND),
      );
    });
  });

});
