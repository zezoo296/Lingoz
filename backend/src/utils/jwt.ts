import jwt from "jsonwebtoken";

export const signToken = (
    payload: string | object,
    secret: jwt.Secret,
    expiresIn: jwt.SignOptions["expiresIn"],
) => {
    return jwt.sign(payload, secret, { expiresIn });
};
