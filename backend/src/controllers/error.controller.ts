import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

interface ErrorWithProperties extends Error {
    statusCode?: number;
    status?: "fail" | "error";
    isOperational?: boolean;

    // Mongoose / MongoDB properties
    code?: number;
    path?: string;
    value?: unknown;

    errors?: Record<
        string,
        {
            message: string;
        }
    >;
}

const handleCastErrorDB = (err: ErrorWithProperties): AppError => {
    const message = `Invalid ${err.path}: ${err.value}.`;

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: ErrorWithProperties): AppError => {
    const message = `Duplicate field value. Please use another value!`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: ErrorWithProperties): AppError => {
    const errors = Object.values(err.errors ?? {}).map((el) => el.message);

    const message = `Invalid input data. ${errors.join(". ")}`;

    return new AppError(message, 400);
};

const sendErrorDev = (err: ErrorWithProperties, res: Response): void => {
    res.status(err.statusCode ?? 500).json({
        status: err.status ?? "error",
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: ErrorWithProperties, res: Response): void => {
    if (err.isOperational) {
        res.status(err.statusCode ?? 500).json({
            status: err.status ?? "error",
            message: err.message,
        });
    } else {
        console.error("ERROR 💥", err);

        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};

const globalErrorHandler = (
    err: ErrorWithProperties,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (res.headersSent) {
        console.error("Error after response was sent:", err);
        return;
    }

    err.statusCode = err.statusCode ?? 500;
    err.status = err.status ?? "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
        return;
    }

    let error = { ...err };

    if (error.name === "CastError") {
        error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error);
    }

    if (error.name === "ValidationError") {
        error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
};

export default globalErrorHandler;
