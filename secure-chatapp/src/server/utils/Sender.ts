import { Response } from 'express';

export const sendError = (res: Response, err: Error) => {
    const code = parseInt(err?.name);
    res.status(code || 500).send(code ? err?.message : "Internal Server Error");
};