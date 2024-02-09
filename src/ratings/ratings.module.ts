import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Rating, RatingSchema } from "src/schemas/Rating.schema";
import { RatingsController } from "./ratings.controller";
import { RatingsService } from "./ratings.service";


@Module({
    imports: [MongooseModule.forFeature([{
        name: Rating.name,
        schema: RatingSchema,
    }])
    ],
    controllers: [RatingsController],
    providers: [
        RatingsService,
    ]
})

export class RatingsModule { }