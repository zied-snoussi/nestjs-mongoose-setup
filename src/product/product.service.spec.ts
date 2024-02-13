import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../schema/Product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schema/Product.schema';
describe('ProductService', () => {
  let service: ProductService;
  let mockProductModel: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ // Define the module imports.
      MongooseModule.forFeature([{ // Import the MongooseModule with the specified features.
          name: Product.name, // Specify the name of the model.
          schema: ProductSchema, // Specify the schema of the model.
      }])
  ],
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    mockProductModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'This is a great product',
        price: '100',
        category: 'Electronics',
      };

      const expectedResult = {
        _id: 'generatedId',
        ...createProductDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockProductModel.prototype.save.mockResolvedValue(expectedResult);

      const result = await service.createProduct(createProductDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const expectedResult = [
        {
          _id: '1',
          name: 'Product 1',
          description: 'This is a great product',
          price: '100',
          category: 'Electronics',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          _id: '2',
          name: 'Product 2',
          description: 'This is another great product',
          price: '200',
          category: 'Electronics',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockProductModel.find.prototype.mockResolvedValue(expectedResult);

      const result = await service.getAllProducts();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const expectedResult = {
        _id: '1',
        name: 'Product 1',
        description: 'This is a great product',
        price: '100',
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockProductModel.findById.prototype.mockResolvedValue(expectedResult);

      const result = await service.getProductById('1');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateProduct', () => {
    it('should update a product by ID', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Product 2',
        description: 'This is another great product',
        price: '200',
        category: 'Electronics',
      };

      const expectedResult = {
        _id: '1',
        ...updateProductDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockProductModel.findByIdAndUpdate.prototype.mockResolvedValue(expectedResult);

      const result = await service.updateProduct('1', updateProductDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      const expectedResult = {
        _id: '1',
        name: 'Product 1',
        description: 'This is a great product',
        price: '100',
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockProductModel.findByIdAndDelete.prototype.mockResolvedValue(expectedResult);

      const result = await service.deleteProduct('1');

      expect(result).toEqual(expectedResult);
    });
  });

});
