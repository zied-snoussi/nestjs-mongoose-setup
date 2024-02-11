import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common"; // Import necessary decorators and modules from '@nestjs/common'.
import { JwtService } from "@nestjs/jwt"; // Import JwtService from '@nestjs/jwt'.
import { Request } from "express"; // Import Request interface from 'express'.

@Injectable() // Injectable decorator to allow dependency injection.
export class JwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }; // Constructor with JwtService injection.

    async canActivate(context: ExecutionContext): Promise<boolean> { // Implementation of the canActivate method.
        const request = context.switchToHttp().getRequest(); // Get the HTTP request from the execution context.
        const token = this.extractTokenFromHeader(request); // Extract the token from the request header.
        if (!token) throw new HttpException('Unauthorized', 401); // If no token is found, throw an Unauthorized error.
        try {
            const payload = await this.jwtService.verifyAsync(token, { // Verify the token using JwtService.
                secret: process.env.JWT_SECRET_KEY // Provide the secret key for token verification.
            });
            request['user'] = payload; // Set the user payload in the request object.
        } catch {
            throw new HttpException('Unauthorized', 401); // If token verification fails, throw an Unauthorized error.
        }
        return true; // If token verification is successful, allow access.
    }

    private extractTokenFromHeader(request: Request) { // Helper method to extract the token from the request header.
        const [type, token] = request.headers.authorization?.split(' ') ?? []; // Extract the token from the authorization header.
        return type === "Bearer" ? token : undefined; // If the token type is 'Bearer', return the token; otherwise, return undefined.
    }
}
