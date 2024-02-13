import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { getModelToken } from '@nestjs/mongoose';
import { Rating } from '../schema/Rating.schema';
import { CreateRatingDto, UpdateRatingDto } from './dto/Rating.dto';
import { Model } from 'mongoose';
import { RatingSchema } from '../schema/Rating.schema';
import { MongooseModule } from '@nestjs/mongoose';
describe('RatingService', () => {
  let service: RatingService;
  let mockRatingModel: Model<Rating>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ // Import the Rating model and associate it with the RatingSchema.
            name: Rating.name,
            schema: RatingSchema,
        }])
    ],
      providers: [
        RatingService,
        {
          provide: getModelToken(Rating.name),
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

    service = module.get<RatingService>(RatingService);
    mockRatingModel = module.get<Model<Rating>>(getModelToken(Rating.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRating', () => {
    it('should create a new rating', async () => {
      const createRatingDto: CreateRatingDto = {
        user_id: 'userId',
        product_id: 'productId',
        rating: 5,
        comment: 'Great product',
      };

      const expectedResult = {
        _id: 'generatedId',
        ...createRatingDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRatingModel.prototype.save.mockResolvedValue(expectedResult);

      const result = await service.createRating(createRatingDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllRatings', () => {
    it('should return all ratings', async () => {
      const expectedResult = [
        {
          _id: 'ratingId1',
          user_id: 'userId1',
          product_id: 'productId1',
          rating: 5,
          comment: 'Great product',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          _id: 'ratingId2',
          user_id: 'userId2',
          product_id: 'productId2',
          rating: 4,
          comment: 'Good product',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockRatingModel.find.prototype.mockResolvedValue(expectedResult);

      const result = await service.getAllRatings();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getRatingById', () => {
    it('should return a rating by its ID', async () => {
      const ratingId = 'ratingId';
      const expectedResult = {
        _id: ratingId,
        user_id: 'userId',
        product_id: 'productId',
        rating: 5,
        comment: 'Great product',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRatingModel.findById.prototype.mockResolvedValue(expectedResult);

      const result = await service.getRatingById(ratingId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateRating', () => {
    it('should update a rating by its ID', async () => {
      const ratingId = 'ratingId';
      const updateRatingDto: UpdateRatingDto = {
        rating: 4,
        comment: 'Good product',
      };

      const expectedResult = {
        _id: ratingId,
        user_id: 'userId',
        product_id: 'productId',
        ...updateRatingDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRatingModel.findByIdAndUpdate.prototype.mockResolvedValue(expectedResult);

      const result = await service.updateRating(ratingId, updateRatingDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating by its ID', async () => {
      const ratingId = 'ratingId';

      mockRatingModel.findByIdAndDelete.prototype.mockResolvedValue(true);

      const result = await service.deleteRating(ratingId);

      expect(result).toBe(true);
    });
  });

});
