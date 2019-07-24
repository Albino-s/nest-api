import { AuthGuard } from '@nestjs/passport';
import {ForbiddenException, UnauthorizedException} from '@nestjs/common';

export class AdminJwtGuard extends AuthGuard('jwt') {

    // Override handleRequest so it never throws an error
    handleRequest(err, user, info, context) {
        if (!user) {
            throw new UnauthorizedException();
        }
        if (!user.isAdmin) {
            throw new ForbiddenException('Forbidden. Admins only');
        }
        return user;
    }

}
