import { Request, Response, NextFunction } from 'express';

type IFunction = (req: Request, res: Response, next: NextFunction) => void;

export const asyncWrapper = (fn: IFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
};

export default asyncWrapper;
