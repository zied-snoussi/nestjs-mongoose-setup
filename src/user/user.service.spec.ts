import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schema/User.schema';
import { CreateUserDto, UpdateUserDto } from './dto/User.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../schema/User.schema';

const users = [
  {
    _id: '1',
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'test@example.com',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    username: 'janesmith',
    email: 'janesmith@example.com',
    role: 'manager',
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Add more mocked user objects as needed
];

const createUserData: CreateUserDto = {
  email: 'existing@example.com',
  password: 'password123',
  first_name: 'test',
  last_name: 'test',
  username: 'test',
  role: 'admin',
};

const updateUserData: UpdateUserDto = {
  password: 'password123',
  first_name: 'test',
  last_name: 'test'
};

describe('UserService', () => {
  let service: UserService;
  const mockUserModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = createUserData;
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
      const mockCreatedUser = {
        _id: 'test_id',
        ...createUserDto,
        password: hashedPassword,
      };

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw an error if email is already taken', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        first_name: 'test',
        last_name: 'test',
        username: 'test',
        role: 'admin',
      };

      mockUserModel.findOne.mockResolvedValue({});

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      mockUserModel.find.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const mockUser = users[0];

      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = '1';

      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const mockUser = users[0];

      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, updateUserData);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = '1';

      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateUserData)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';
      const mockUser = users[0];

      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await service.deleteUser(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = '1';

      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

});
