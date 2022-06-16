import { NextFunction, Request, Response } from 'express';

interface TokenData {
    [key: string]: any;
}
interface IAuthService {
    verifyAccess: <T extends TokenData>(tokenString: string) => Promise<T>;
};

declare module "express" {
    interface Request {
        auth?: TokenData;
    }
}

const authenticate = (service: IAuthService) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (typeof authHeader !== "string") return res.status(403).send("No authorization header specified");
        const headerParts = authHeader.split(" ");
        if (headerParts[0] !== "Bearer") return res.status(403).send("Invalid authorization header type. Header must be bearer");
        const tokenString = headerParts[1];
        if (!tokenString) return res.status(403).send("Invalid authorization header");

        service.verifyAccess(tokenString).then((tokenContent) => {
            req.auth = tokenContent;
            return next();
        }).catch((err) => {
            if (err?.message && err?.name) {
                return res.status(err?.name).send(err.message);
            }
            return res.sendStatus(500);
        });
    };
};

export default authenticate; 