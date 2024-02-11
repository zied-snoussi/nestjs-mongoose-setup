import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { User, UserSchema } from "../schema/User.schema"; // Import the User schema and UserSchema from the schemas folder.
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([{
        name: User.name,
        schema: UserSchema,
    }]),
    JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET_KEY,
    })
    ],
    controllers: [UserController],
    providers: [
        UserService,
        JwtService,
    ],
})
// The UsersModule class is a feature module that imports the User schema into the application.
export class UserModule { }