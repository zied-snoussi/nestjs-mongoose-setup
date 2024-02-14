import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from './dto/Product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schema/Product.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test.local', // Load environment variables from local file
        }),
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
      ],
      controllers: [ProductController],
      providers: [
        ProductService,
        JwtService, // Provide JwtService here
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            getAllProducts: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        category: 'Test Category',
      };
      const createdProduct= {
        _id: 'test_id',
        ...createProductDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(productService, 'createProduct').mockResolvedValue(createdProduct as any);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual(createdProduct);
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products: ProductResponseDto[] = [
        {
          _id: 'test_id',
          name: 'Test Product',
          description: 'This is a test product',
          price: '100',
          category: 'Test Category',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(productService, 'getAllProducts').mockResolvedValue(products as any);

      const result = await controller.getAllProducts();

      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('should return a product', async () => {
      const product: ProductResponseDto = {
        _id: 'test_id',
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        category: 'Test Category',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(productService, 'getProductById').mockResolvedValue(product as any);

      const result = await controller.getProductById('test_id');

      expect(result).toEqual(product);
    });

    it('should throw an error if product not found', async () => {
      jest.spyOn(productService, 'getProductById').mockResolvedValue(null);

      await expect(controller.getProductById('invalid_id')).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        category: 'Test Category',
      };
      const updatedProduct = {
        _id: '122356',
        ...updateProductDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(productService, 'updateProduct').mockResolvedValue(updatedProduct as any);

      const result = await controller.updateProduct('test_id', updateProductDto);

      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error if product not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        category: 'Test Category',
      };
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(null);

      await expect(controller.updateProduct('invalid_id', updateProductDto)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(true as any);

      const result = await controller.deleteProduct('test_id');

      expect(result).toBe(true);
    });

    it('should throw an error if product not found', async () => {
      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(null);

      await expect(controller.deleteProduct('invalid_id')).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

});
