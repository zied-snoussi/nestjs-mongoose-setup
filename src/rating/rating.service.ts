import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { Rating } from "../schema/Rating.schema";
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from "./dto/Rating.dto";

@Injectable()
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>) { }

    createRating(createRatingDto: CreateRatingDto) {
        const newRating = new this.ratingModel(createRatingDto);
        return newRating.save();
    }

    async getAllRatings(): Promise<RatingResponseDto[]> {
        return await this.ratingModel.find();
    }

    async getRatingById(id: string): Promise<RatingResponseDto> {
        return await this.ratingModel.findById(id);
    }

    async updateRating(id: string, updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
        return await this.ratingModel.findByIdAndUpdate(id, updateRatingDto, { new: true });
    }

    async deleteRating(id: string) {
        return await this.ratingModel.findByIdAndDelete(id);
    }
}
