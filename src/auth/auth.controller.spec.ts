import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponseDto } from '../user/dto/User.dto';
import { LoginDto } from './dto/Auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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
      const createUserDto: CreateUserDto = { username: 'test', email: 'test@gmail.com', password: 'password123', role: 'admin', first_name: 'test', last_name: 'user'};
      await controller.register(createUserDto);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with the provided dto', async () => {
      const loginDto: LoginDto = { email:'test@gmail.com', password: 'password123'};
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
