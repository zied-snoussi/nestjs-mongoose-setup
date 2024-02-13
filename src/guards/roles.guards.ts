import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@Injectable() // Injectable decorator to allow dependency injection.
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { } // Constructor with Reflector injection.

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userRole = request.headers?.userrole;
        if (userRole && requiredRoles.includes(userRole)) { // Check if the user role is included in the required roles.
            return true;
        }
        return false;
    }
}
