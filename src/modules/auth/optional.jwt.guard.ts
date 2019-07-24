import { AuthGuard } from '@nestjs/passport';
import {UnauthorizedException} from '@nestjs/common';

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {

    // Override handleRequest so it never throws an error
    handleRequest(err, user, info, context) {
        if (!user && info.message !== 'No auth token') {
            throw new UnauthorizedException();
        }
        return user;
    }

}
