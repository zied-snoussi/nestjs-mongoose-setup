<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS MongoDB Starter</h1>

<div align="center">

  [![License](https://img.shields.io/github/license/zied-snoussi/nestjs-mongoose-setup)](https://github.com/zied-snoussi/nestjs-mongoose-setup/blob/main/LICENSE)
  [![Issues](https://img.shields.io/github/issues/zied-snoussi/nestjs-mongoose-setup)](https://github.com/zied-snoussi/nestjs-mongoose-setup/issues)
  [![Stars](https://img.shields.io/github/stars/zied-snoussi/nestjs-mongoose-setup)](https://github.com/zied-snoussi/nestjs-mongoose-setup/stargazers)
  [![Forks](https://img.shields.io/github/forks/zied-snoussi/nestjs-mongoose-setup)](https://github.com/zied-snoussi/nestjs-mongoose-setup/network/members)

</div>

## Description

This repository provides a solid foundation for building NestJS applications with MongoDB using Mongoose. It includes setup for MongoDB connectivity, user schema creation, CRUD operations implementation, as well as sign-in and sign-up functionalities.

## Features

- MongoDB integration with Mongoose
- User authentication with JWT
- Secure password hashing with bcrypt
- Comprehensive error handling
- Unit and end-to-end testing setup

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file in the root directory of the project and define the following environment variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d
```

## Running the App

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

```bash
# Run unit tests
$ npm run test

# Run end-to-end tests
$ npm run test:e2e

# Generate test coverage report
$ npm run test:cov
```

## Routes

- `/users`: Endpoint for user management (authentication, CRUD operations).
- `/products`: Endpoint for managing products (CRUD operations).
- `/ratings`: Endpoint for managing ratings (CRUD operations).
- `/orders`: Endpoint for managing orders (CRUD operations).

## Swagger Documentation

The API endpoints are documented using Swagger. After running the application, you can access the Swagger UI at `http://localhost:5000/api`.

## Support

Nest is an MIT-licensed open-source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

This project is licensed under the terms of the [MIT license](LICENSE).