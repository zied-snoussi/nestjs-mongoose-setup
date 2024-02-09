import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from "./dto/Rating.dto";
import mongoose from "mongoose";
import { RatingsService } from "./ratings.service";


@Controller('ratings')
export class RatingsController {
    constructor(private ratingService: RatingsService) { }
    @Post()
    @UsePipes(new ValidationPipe())
    createRating(@Body() createRatingDto: CreateRatingDto) {
        return this.ratingService.createRating(createRatingDto);
    }

    @Get()
    async getAllRatings(): Promise<RatingResponseDto[]> {
        const ratings = await this.ratingService.getAllRatings();
        if (!ratings) throw new HttpException('No ratings found', 404);
        return ratings;
    }

    @Get(':id')
    async getRatingById(@Param('id') id: string): Promise<RatingResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const rating = await this.ratingService.getRatingById(id);
        if (!rating) throw new HttpException('No rating found', 404);
        return rating;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateRating(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const rating = await this.ratingService.updateRating(id, updateRatingDto);
        if (!rating) throw new HttpException('No rating found', 404);
        return rating;
    }

    @Delete(':id')
    async deleteRating(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const deletedRating = await this.ratingService.deleteRating(id);
        if (!deletedRating) throw new HttpException('No rating found', 404);
        return "Rating deleted successfully";
    }
}
