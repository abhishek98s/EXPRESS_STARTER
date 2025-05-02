// import { NextFunction, Request, Response } from 'express';
// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// import path from 'path';

// // Create a new instance of the Winston logger
// export const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [
//         new DailyRotateFile({
//             filename: path.join('logs', 'application-%DATE%.log'),
//             datePattern: 'YYYY-MM-DD',
//             maxSize: '5m',
//         }),
//     ],
// });

// // Middleware function to log requests and responses
// export const logMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//     // Log the request data
//     logger.info({
//         message: 'Request received',
//         method: req.method,
//         url: req.originalUrl,
//         params: req.params,
//         query: req.query,
//         body: req.body,
//         formdata: req.files,
//     });

//     // Save the original response.send function
//     const originalSend = res.send;

//     // Override the response.send function to intercept the response body and log it
//     res.send = function (body?: any): any {
//         // Log the response data
//         logger.info({
//             message: 'Response sent',
//             status: res.statusCode,
//             body: body,
//         });

//         // Call the original response.send function
//         originalSend.call(this, body);
//     };

//     next();
// };
