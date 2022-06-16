import { Request, Response, Router } from 'express';
import ws from "ws";
import { chatLogic, jwtLogic } from '../logic';
import authenticate from '../middleware/authenticate';
import WsConnect from '../utils/WsConnect';

const router = Router();

const wsRoute = new ws.Server({
    noServer: true,
});

router.get("/chatlog", authenticate(jwtLogic), (req, res) => {
    res.send(chatLogic.GetChatlog());
});
router.get("/connect", authenticate(jwtLogic), WsConnect(wsRoute));

wsRoute.on("connection", (socket, req: Request) => {
    console.log(req.auth);

    console.log("connect");
});

export default router; 