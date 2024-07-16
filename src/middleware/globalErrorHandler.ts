import { Request, Response, NextFunction } from 'express';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Global Error Handler:', err.stack);

    let statusCode = err instanceof Error ? 500 : err?.status || 500;
    let message = err.message || 'Internal Server Error';

    const errorResponse = {
        error: {
            status: statusCode,
            message: message
        }
    };

    res.status(statusCode).json(errorResponse);
}


export default errorHandler