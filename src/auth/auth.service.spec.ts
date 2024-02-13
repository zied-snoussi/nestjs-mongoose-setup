import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should generate tokens and return user data if login is successful', async () => {
      const user = { username: 'test', _id: '12345', password: 'password' };
      const dto = { email: 'test@example.com', password: 'password' };

      bcrypt.compare.mockResolvedValue(true);

      const result = await service.login(dto);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2); // Once for accessToken, once for refreshToken
      expect(result.user).toEqual({ username: 'test', _id: '12345' });
      expect(result.backendTokens).toHaveProperty('accessToken');
      expect(result.backendTokens).toHaveProperty('refreshToken');
    });

    it('should throw Unauthorized exception if credentials are invalid', async () => {
      const dto = { email: 'test@example.com', password: 'password' };

      bcrypt.compare.mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrowError(new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED));
    });
  });

  describe('refreshToken', () => {
    it('should generate new tokens', async () => {
      const user = { username: 'test', _id: '12345' };

      const result = await service.refreshToken(user);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2); // Once for accessToken, once for refreshToken
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });
  });

  describe('register', () => {
    it('should call userService.createUser with the provided dto', async () => {
      const createUserDto = { username: 'test', email: 'test@example.com', password: 'password123', role: 'admin', first_name: 'test', last_name: 'user' };

      await service.register(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});
