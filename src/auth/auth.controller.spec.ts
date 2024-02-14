import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponseDto } from '../user/dto/User.dto';
import { LoginDto } from './dto/Auth.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/User.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test.local', // Load environment variables from local file
        }),
        // Connect to MongoDB database using Mongoose
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
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

      controllers: [AuthController],
      providers: [
        JwtService,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with the provided dto', async () => {
      const createUserDto: CreateUserDto = { username: 'test', email: 'test@gmail.com', password: 'password123', role: 'admin', first_name: 'test', last_name: 'user' };

      await controller.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with the provided dto', async () => {
      const loginDto: LoginDto = { email: 'test@gmail.com', password: 'password123' };

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should call authService.refreshToken with the user from the request', async () => {
      const req = { user: { username: 'test', sub: '123' } };

      await controller.refresh(req);

      expect(authService.refreshToken).toHaveBeenCalledWith(req.user);
    });
  });
});
