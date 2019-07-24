import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
    HttpServer,
    Injectable
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new Logger();

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
            super.catch(exception, host);
            return;
        }
        this.logger.error(exception);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            debug: (exception as HttpException).message,
        });
    }
}
