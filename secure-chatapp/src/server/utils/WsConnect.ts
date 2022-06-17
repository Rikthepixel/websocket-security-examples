import { Request, Response } from 'express';
import { Server, WebSocket } from "ws";

const disallowedEvents = ["close", "error", "message", "open", "ping", "pong", "redirect", "unexprected-response", "upgrade"];

type IWsArgs = any | { [key: string]: any; };

export type UseHandler = (event: string, data: any, socket: WsExtended, req: Request) => boolean | Promise<boolean>;
export class WsExtended extends WebSocket {
    use: (handler: UseHandler) => void;
    sendType: (event: string, args: IWsArgs) => void;
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

            ws.sendType = (event: string, args: IWsArgs) => {
                ws.send(JSON.stringify({
                    type: event,
                    args: args
                }));
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

                let shouldContinue = true;
                for (const func of middleware) {

                    const isAsync = func.constructor.name === 'AsyncFunction';
                    if (isAsync) {
                        shouldContinue = await func(data.type, data.args, ws, req);
                    } else {
                        shouldContinue = func(data.type, data.args, ws, req) as boolean;
                    }

                    if (!shouldContinue) {
                        return;
                    }
                }

                ws.emit(data.type, data.args);
            });

            wsApp.emit('connection', ws, req);
            onConnect?.(ws, req);
        });


    };
};