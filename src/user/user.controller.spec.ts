import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UserListResponseDto } from './dto/User.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const users = [
  {
    _id: '1',
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
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


describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // createUser
  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };
      const createdUser = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      // userService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      // userService.createUser.mockResolvedValue(null);

      await expect(controller.createUser(createUserDto)).rejects.toThrowError(new HttpException('User not created', HttpStatus.NOT_FOUND));
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      // userService.getAllUsers.mockResolvedValue(users);
      const result = await controller.getAllUsers();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should throw error if no users found', async () => {
      // userService.getAllUsers.mockResolvedValue(null);
      await expect(controller.getAllUsers()).rejects.toThrowError(new HttpException('No users found', HttpStatus.NOT_FOUND));
    });
  });

  //getUserById
  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = users[0];
      // userService.getUserById.mockResolvedValue(user);

      const result = await controller.getUserById(id);

      expect(userService.getUserById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    }

    );
    it('should throw error if user not found', async () => {
      const id = '1';
      // userService.getUserById.mockResolvedValue(null);
      await expect(controller.getUserById(id)).rejects.toThrowError(new HttpException('No user found', HttpStatus.NOT_FOUND));
    });
  });

  //updateUser
  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = '1';
      const updateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };
      const updatedUser = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };
      // userService.updateUser.mockResolvedValue(updatedUser);
      const result = await controller.updateUser(id, updateUserDto);
      expect(userService.updateUser).toHaveBeenCalledWith(id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
    it('should throw error if user not found', async () => {
      const id = '1';
      const updateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };
      // userService.updateUser.mockResolvedValue(null);
      await expect(controller.updateUser(id, updateUserDto)).rejects.toThrowError(new HttpException('No user found', HttpStatus.NOT_FOUND));
    });
  });

  //deleteUser
  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const id = '1';
      // userService.deleteUser.mockResolvedValue('User deleted successfully');

      const result = await controller.deleteUser(id);

      expect(userService.deleteUser).toHaveBeenCalledWith(id);
      expect(result).toEqual('User deleted successfully');
    });
    it('should throw error if user not found', async () => {
      const id = '1';
      // userService.deleteUser.mockResolvedValue(null);
      await expect(controller.deleteUser(id)).rejects.toThrowError(new HttpException('No user found', HttpStatus.NOT_FOUND));
    });
  })
});




