import { CanActivate, ExecutionContext, Injectable, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { };
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new HttpException('Unauthorized', 401);
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_TOKEN,
            });
            request['user'] = payload;
        } catch {
            throw new HttpException('Unauthorized', 401);
        }
        return true;
    }
    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === "Refresh" ? token : undefined;
    }
}