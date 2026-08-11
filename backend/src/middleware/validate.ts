import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import AppError from "../utils/AppError";

const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");
            return next(new AppError(message || "Invalid Request Body", 400));
        }

        req.body = result.data;

        next();
    };
};

export default validate;
