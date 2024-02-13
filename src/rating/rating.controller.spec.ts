import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from './dto/Rating.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from '../schema/Rating.schema';
describe('RatingController', () => {
  let controller: RatingController;
  let ratingService: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ // Import the Rating model and associate it with the RatingSchema.
            name: Rating.name,
            schema: RatingSchema,
        }])
    ],
      controllers: [RatingController],
      providers: [
        {
          provide: RatingService,
          useValue: {
            createRating: jest.fn(),
            getAllRatings: jest.fn(),
            getRatingById: jest.fn(),
            updateRating: jest.fn(),
            deleteRating: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RatingController>(RatingController);
    ratingService = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRating', () => {
    it('should create a new rating', async () => {
      const createRatingDto: CreateRatingDto = {
        user_id: 'user_id',
        product_id: 'product_id',
        rating: 5,
        comment: 'This is a great product',
      };
      const createdRating= {
        _id: 'rating_id',
        ...createRatingDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      ratingService.createRating.prototype.mockResolvedValue(createdRating);

      const result = await controller.createRating(createRatingDto);

      expect(ratingService.createRating).toHaveBeenCalledWith(createRatingDto);
      expect(result).toEqual(createdRating);
    });

    it('should throw error if rating creation fails', async () => {
      const createRatingDto: CreateRatingDto = {
        user_id: 'user_id',
        product_id: 'product_id',
        rating: 5,
        comment: 'This is a great product',
      };

      ratingService.createRating.prototype.mockResolvedValue(null);

      await expect(controller.createRating(createRatingDto)).rejects.toThrow(new HttpException('Rating not created', HttpStatus.NOT_FOUND));
    });
  });

  describe('getAllRatings', () => {
    it('should return list of all ratings', async () => {
      const ratings: RatingResponseDto[] = [
        {
          _id: 'rating_id',
          user_id: 'user_id',
          product_id: 'product_id',
          rating: 5,
          comment: 'This is a great product',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      ratingService.getAllRatings.prototype.mockResolvedValue(ratings);

      const result = await controller.getAllRatings();

      expect(ratingService.getAllRatings).toHaveBeenCalled();
      expect(result).toEqual(ratings);
    });

    it('should throw error if no ratings found', async () => {
      ratingService.getAllRatings.prototype.mockResolvedValue(null);

      await expect(controller.getAllRatings()).rejects.toThrow(new HttpException('No ratings found', HttpStatus.NOT_FOUND));
    });
  });

  describe('getRatingById', () => {
    it('should return a rating by id', async () => {
      const rating: RatingResponseDto = {
        _id: 'rating_id',
        user_id: 'user_id',
        product_id: 'product_id',
        rating: 5,
        comment: 'This is a great product',
        created_at: new Date(),
        updated_at: new Date(),
      };

      ratingService.getRatingById.prototype.mockResolvedValue(rating);

      const result = await controller.getRatingById('rating_id');

      expect(ratingService.getRatingById).toHaveBeenCalledWith('rating_id');
      expect(result).toEqual(rating);
    });

    it('should throw error if no rating found', async () => {
      ratingService.getRatingById.prototype.mockResolvedValue(null);

      await expect(controller.getRatingById('rating_id')).rejects.toThrow(new HttpException('No rating found', HttpStatus.NOT_FOUND));
    });
  });

  describe('updateRating', () => {
    it('should update a rating by id', async () => {
      const updateRatingDto: UpdateRatingDto = {
        rating: 5,
        comment: 'This is a great product',
      };
      const rating: RatingResponseDto = {
        _id: 'rating_id',
        user_id: 'user_id',
        product_id: 'product_id',
        rating: 5,
        comment: 'This is a great product',
        created_at: new Date(),
        updated_at: new Date(),
      };

      ratingService.updateRating.prototype.mockResolvedValue(rating);

      const result = await controller.updateRating('rating_id', updateRatingDto);

      expect(ratingService.updateRating).toHaveBeenCalledWith('rating_id', updateRatingDto);
      expect(result).toEqual(rating);
    });

    it('should throw error if no rating found', async () => {
      ratingService.updateRating.prototype.mockResolvedValue(null);

      await expect(controller.updateRating('rating_id', { rating: 5, comment: 'This is a great product' })).rejects.toThrow(new HttpException('No rating found', HttpStatus.NOT_FOUND));
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating by id', async () => {
      ratingService.deleteRating.prototype.mockResolvedValue('Rating deleted successfully');

      const result = await controller.deleteRating('rating_id');

      expect(ratingService.deleteRating).toHaveBeenCalledWith('rating_id');
      expect(result).toEqual('Rating deleted successfully');
    });

    it('should throw error if no rating found', async () => {
      ratingService.deleteRating.prototype.mockResolvedValue(null);

      await expect(controller.deleteRating('rating_id')).rejects.toThrow(new HttpException('No rating found', HttpStatus.NOT_FOUND));
    });
  });

});
