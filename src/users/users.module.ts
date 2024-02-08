import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { User, UserSchema } from "src/schemas/User.schema"; // Import the User schema and UserSchema from the schemas folder.
import { UserService } from "./users.service";
import { UserController } from "./user.controller";
// The UsersModule is a feature module that imports the User schema into the application.
@Module({
    // The MongooseModule.forFeature() method is used to import the User schema into the UsersModule.
    imports: [MongooseModule.forFeature([{
        name: User.name,
        schema: UserSchema,
    }])
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ]
})
// The UsersModule class is a feature module that imports the User schema into the application.
export class UsersModule { }