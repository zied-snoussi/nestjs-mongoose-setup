import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { Rating, RatingSchema } from "../schema/Rating.schema"; // Import the Rating schema and RatingSchema from the schemas folder.
import { RatingController } from "./rating.controller"; // Import the RatingController from the rating.controller file.
import { RatingService } from "./rating.service"; // Import the RatingService from the rating.service file.

@Module({
    imports: [
        MongooseModule.forFeature([{ // Import the Rating model and associate it with the RatingSchema.
            name: Rating.name,
            schema: RatingSchema,
        }])
    ],
    controllers: [RatingController], // Declare the RatingController as a controller in the module.
    providers: [RatingService], // Declare the RatingService as a provider in the module.
})
export class RatingModule { } // Export the RatingModule class as a module.
