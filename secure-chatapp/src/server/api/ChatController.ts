import { Request, response, Router } from 'express';
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
    res.send({
        messages: chatLogic.GetChatlog()
    });
});

router.get("/connect", authenticate(jwtLogic, true), WsConnect(wsRoute, (socket: WsExtended, req: Request) => {
    const authData = req.auth;
    const userData = authData.data;

    socket.use(() => {
        if (!jwtLogic.verifyDate(authData.exp)) {
            socket.sendType("reauthenticate-request", null);
            return false;
        }
        return true;
    });

    socket.on("reauthenticate-response", async (token: string) => {
        let tokens = null;
        try {
            tokens = await jwtLogic.signAccess({ username: userData.username }, token, true);
        } catch (err) {
            console.log(err);
        }
        socket.sendType("reauthenticate-response", tokens);
    });

    socket.on("user-message", (text: string) => {

        chatLogic.SendMessage({
            username: userData.username,
            text: text
        });

    });

    const handleMessage = (message: IMessage) => socket.sendType("user-message", message);;

    chatLogic.ListenForMessages(handleMessage);

    socket.on("close", () => {
        chatLogic.StopListeningForMessages(handleMessage);
    });
}));

export default router; 