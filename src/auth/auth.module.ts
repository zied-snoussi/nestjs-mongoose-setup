import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/User.schema';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        }),
        // MongooseModule.forFeature() imports the User schema into the MongooseModule.
        MongooseModule.forFeature([
            {
                name: User.name, // Specify the name of the schema.
                schema: UserSchema, // Specify the schema itself.
            }
        ]),
    ],
    providers: [AuthService, UserService],
    controllers: [AuthController],
})
export class AuthModule { }


