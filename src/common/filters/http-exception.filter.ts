import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                const resObj = res as Record<string, unknown>;
                message = (resObj.message as string | string[]) ?? exception.message;
                error = (resObj.error as string) ?? HttpStatus[status];
            }
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                status = HttpStatus.BAD_REQUEST;
                message = 'A record with this value already exists';
                error = 'Bad Request';
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Resource not found';
                error = 'Not Found';
            }
        } else {
            this.logger.error(exception);
        }

        response.status(status).json({
            statusCode: status,
            message,
            error,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}