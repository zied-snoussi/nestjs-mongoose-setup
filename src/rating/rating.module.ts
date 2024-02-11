import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Rating, RatingSchema } from "../schema/Rating.schema";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";


@Module({
    imports: [MongooseModule.forFeature([{
        name: Rating.name,
        schema: RatingSchema,
    }])
    ],
    controllers: [RatingController],
    providers: [
        RatingService,
    ]
})

export class RatingModule { }