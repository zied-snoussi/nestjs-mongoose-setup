import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from "./dto/Rating.dto";
import mongoose from "mongoose";
import { RatingService } from "./rating.service";
import { JwtGuard } from "src/guadrs/jwt.guards";


@Controller('ratings')
export class RatingController {
    constructor(private ratingService: RatingService) { }
    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    createRating(@Body() createRatingDto: CreateRatingDto) {
        return this.ratingService.createRating(createRatingDto);
    }

    @Get()
    @UseGuards(JwtGuard)
    async getAllRatings(): Promise<RatingResponseDto[]> {
        const ratings = await this.ratingService.getAllRatings();
        if (!ratings) throw new HttpException('No ratings found', 404);
        return ratings;
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getRatingById(@Param('id') id: string): Promise<RatingResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const rating = await this.ratingService.getRatingById(id);
        if (!rating) throw new HttpException('No rating found', 404);
        return rating;
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    async updateRating(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const rating = await this.ratingService.updateRating(id, updateRatingDto);
        if (!rating) throw new HttpException('No rating found', 404);
        return rating;
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteRating(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid rating id', 400);
        const deletedRating = await this.ratingService.deleteRating(id);
        if (!deletedRating) throw new HttpException('No rating found', 404);
        return "Rating deleted successfully";
    }
}
