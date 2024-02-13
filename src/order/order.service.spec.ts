import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from './dto/Order.dto';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schema/Order.schema';

describe('OrderService', () => {
  let service: OrderService;
  let orderModel: Model<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forFeature([{ // Import the MongooseModule with the Order schema.
        name: Order.name,
        schema: OrderSchema,
    }])],
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      const mockOrder = {
        _id: 'test_order_id',
        ...createOrderDto,
      };
      jest.spyOn(orderModel.prototype, 'save').mockResolvedValue(mockOrder);

      const result = await service.createOrder(createOrderDto);

      expect(result).toEqual(mockOrder);
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
      jest.spyOn(orderModel, 'find').mockResolvedValue(mockOrders);

      const result = await service.getAllOrders();

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
      jest.spyOn(orderModel, 'findById').mockResolvedValue(mockOrder);

      const result = await service.getOrderById('test_order_id');

      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Delivered',
      };
      const mockOrder = {
        _id: 'test_order_id',
        ...updateOrderDto,
      };
      jest.spyOn(orderModel, 'findByIdAndUpdate').mockResolvedValue(mockOrder);

      const result = await service.updateOrder('test_order_id', updateOrderDto);

      expect(result).toEqual(mockOrder);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const mockOrder = {
        _id: 'test_order_id',
        user_id: 'test_user_id',
        product_id: 'test_product_id',
        quantity: '5',
        status: 'Pending',
      };
      jest.spyOn(orderModel, 'findByIdAndDelete').mockResolvedValue(mockOrder);

      const result = await service.deleteOrder('test_order_id');

      expect(result).toEqual(mockOrder);
    });
  });

});
