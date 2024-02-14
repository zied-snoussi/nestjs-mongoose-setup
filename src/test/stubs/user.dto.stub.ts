import { CreateUserDto, UpdateUserDto } from "../../user/dto/User.dto";

export const UserDtoStub: CreateUserDto = {
    email: 'jhondoe@gmail.com',
    password: 'password123',
    role: 'admin',
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe'
};


export const UsersDtoSubResponse = [
    {
        _id: expect.any(String),
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        password: expect.any(String), // The password will be of type String
        email: 'jhondoe@gmail.com',
        role: 'admin',
        created_at: expect.any(String), // The created_at will be of type String
        updated_at: expect.any(String), // The updated_at will be of type String
        __v: expect.any(Number) // The __v field will be of type Number
    }
];


export const UpdateUserDtoStub = {
    first_name: 'John',
    last_name: 'Doe',
    password: 'password123',
};


