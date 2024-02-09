import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { User, UserSchema } from "src/schemas/User.schema"; // Import the User schema and UserSchema from the schemas folder.
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
// The UsersModule is a feature module that imports the User schema into the application.
@Module({
    // The MongooseModule.forFeature() method is used to import the User schema into the UsersModule.
    imports: [MongooseModule.forFeature([{
        name: User.name,
        schema: UserSchema,
    }])
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
    ]
})
// The UsersModule class is a feature module that imports the User schema into the application.
export class UsersModule { }