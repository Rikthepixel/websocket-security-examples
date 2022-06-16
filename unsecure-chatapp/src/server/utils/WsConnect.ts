import { Request, Response } from 'express';
import { Server, WebSocket } from "ws";

const disallowedEvents = ["close", "error", "message", "open", "ping", "pong", "redirect", "unexprected-response", "upgrade"];

export type UseHandler = (event: string, data: any, socket: WsExtended, req: Request) => void | Promise<void>;
export class WsExtended extends WebSocket {
    use: (handler: UseHandler) => void;
}

export default (wsApp: Server, onConnect?: (socket: WsExtended, req: Request) => void) => {
    return (req: Request, res: Response) => {
        const upgradeHeader = req?.headers.upgrade;
        if (upgradeHeader !== "websocket") return res.status(400).send("Invalid upgrade header");

        const success = wsApp.shouldHandle(req);
        if (!success) return res.status(400).send("Server cannot handle request");

        wsApp.handleUpgrade(req, req.socket, Buffer.from(""), (ws: WsExtended) => {
            const middleware: UseHandler[] = [];
            ws.use = (handler: UseHandler) => {
                middleware.push(handler);
            };

            ws.on("message", async (rawData) => {
                let data = null;
                try {
                    data = JSON.parse(rawData.toString());
                } catch (error) {
                    return;
                }

                if (!data.type || disallowedEvents.includes(data.type)) {
                    return;
                }

                for (const func of middleware) {
                    const isAsync = func.constructor.name === 'AsyncFunction';
                    if (isAsync) {
                        await func(data.type, data.args, ws, req);
                    } else {
                        func(data.type, data.args, ws, req);
                    }
                }

                ws.emit(data.type, data.args);
            });

            wsApp.emit('connection', ws, req);
            onConnect?.(ws, req);
        });


    };
};