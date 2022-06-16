import { Request, Response } from 'express';
import { Server } from "ws";

export default (wsApp: Server) => {
    return (req: Request, res: Response) => {
        const upgradeHeader = req?.headers.upgrade;
        if (upgradeHeader !== "websocket") return res.status(400).send("Invalid upgrade header");

        console.log("handle upgrade");

        const success = wsApp.shouldHandle(req);
        if (!success) return res.status(400).send("Server cannot handle request");

        wsApp.handleUpgrade(req, req.socket, Buffer.from(""), (ws) => {
            wsApp.emit('connection', ws, req);
        });
    };
};