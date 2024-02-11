import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { User, UserSchema } from "../schema/User.schema"; // Import the User schema and UserSchema from the schemas folder.
import { UserService } from "./user.service"; // Import the UserService from the user.service file.
import { UserController } from "./user.controller"; // Import the UserController from the user.controller file.
import { JwtModule } from "@nestjs/jwt"; // Import the JwtModule from the @nestjs/jwt library.

@Module({
    // The imports array contains modules required by this module.
    imports: [
        // MongooseModule.forFeature() imports the User schema into the MongooseModule.
        MongooseModule.forFeature([
            {
                name: User.name, // Specify the name of the schema.
                schema: UserSchema, // Specify the schema itself.
            }
        ]),
        // JwtModule.register() imports the JwtModule and configures it to use a global secret.
        JwtModule.register({
            global: true, // Set the module to be available globally.
            secret: process.env.JWT_SECRET_KEY, // Use the JWT secret key from environment variables.
        })
    ],
    // The controllers array contains the controller classes that belong to this module.
    controllers: [UserController], // UserController handles HTTP requests related to users.
    // The providers array contains the providers that will be available within this module.
    providers: [
        UserService, // UserService provides business logic related to users.
    ],
})
// The UsersModule class is a feature module that imports the User schema into the application.
export class UserModule { }
