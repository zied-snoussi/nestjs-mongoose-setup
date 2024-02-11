import { Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the @nestjs/mongoose library.
import { Model } from "mongoose"; // Import the Model type from the mongoose library.
import { Rating } from "../schema/Rating.schema"; // Import the Rating schema from the schemas folder.
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from "./dto/Rating.dto"; // Import DTOs for rating operations.

@Injectable() // Decorator to mark the class as injectable and allow dependency injection.
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>) { } // Inject the Rating model into the RatingService.

    // Method to create a new rating.
    createRating(createRatingDto: CreateRatingDto) {
        const newRating = new this.ratingModel(createRatingDto); // Create a new instance of the Rating model with the provided data.
        return newRating.save(); // Save the new rating to the database.
    }

    // Method to retrieve all ratings.
    async getAllRatings(): Promise<RatingResponseDto[]> {
        return await this.ratingModel.find(); // Find all ratings in the database and return them.
    }

    // Method to retrieve a rating by its ID.
    async getRatingById(id: string): Promise<RatingResponseDto> {
        return await this.ratingModel.findById(id); // Find a rating by its ID in the database and return it.
    }

    // Method to update a rating by its ID.
    async updateRating(id: string, updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
        return await this.ratingModel.findByIdAndUpdate(id, updateRatingDto, { new: true }); // Find a rating by its ID, update it with the provided data, and return the updated rating.
    }

    // Method to delete a rating by its ID.
    async deleteRating(id: string) {
        return await this.ratingModel.findByIdAndDelete(id); // Find a rating by its ID and delete it from the database.
    }
}
