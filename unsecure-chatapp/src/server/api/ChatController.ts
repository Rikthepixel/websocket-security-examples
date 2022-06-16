import { Request, Router } from 'express';
import { chatLogic, jwtLogic } from '../logic';
import { IMessage } from '../logic/ChatLogic';
import authenticate from '../middleware/authenticate';
import WsConnect, { WsExtended } from '../utils/WsConnect';
import ws from 'ws';

const router = Router();

const wsRoute = new ws.Server({
    noServer: true,
});

router.get("/chatlog", authenticate(jwtLogic), (req, res) => {
    res.send(chatLogic.GetChatlog());
});
router.get("/connect", authenticate(jwtLogic), WsConnect(wsRoute, (socket: WsExtended, req: Request) => {
    const user = req.auth.data;
    
    socket.on("user-message", (text: string) => {

        chatLogic.SendMessage({
            username: user.username,
            text: text
        });

    });

    const handleMessage = (message: IMessage) => {
        if (message.username === user) return;
        socket.send({ type: "user-message", args: message });
    };

    chatLogic.ListenForMessages(handleMessage);

    socket.on("close", () => {
        chatLogic.StopListeningForMessages(handleMessage);
    });
}));

export default router; 