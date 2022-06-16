import { NextFunction, Request, Response } from 'express';

interface TokenData {
    [key: string]: any;
}
interface IAuthService {
    verifyAccess: (tokenString: string) => Promise<TokenData>;
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
            if (err.name === "JwtParseError") {
                return res.status(403).send(err.userMessage);
            }

            if (err?.message && err?.name) {
                const code = parseInt(err?.name);
                return res.status(code || 500).send(code ? err.message : "Internal Server Error");
            }
            return res.sendStatus(500);
        });
    };
};

export default authenticate; 