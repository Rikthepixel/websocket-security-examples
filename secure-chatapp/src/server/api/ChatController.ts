import { Request, response, Router } from 'express';
import { chatLogic, jwtLogic } from '../logic';
import { IMessage } from '../logic/ChatLogic';
import authenticate from '../middleware/authenticate';
import WsConnect, { WsExtended } from '../utils/WsConnect';
import socketLimiter from "ws-rate-limit";
import ws from 'ws';

const router = Router();

const wsRoute = new ws.Server({
    noServer: true,
    maxPayload: 10485760 //10MiB
});

const limiter = socketLimiter("1s", 10); //can only make 10 requests every second

router.get("/chatlog", authenticate(jwtLogic), (req, res) => {
    res.send({
        messages: chatLogic.GetChatlog()
    });
});

const handleAuthenticatedRequest = (socket, authData, executeRequest: (...args: any[]) => any) => {
    //Check if the client needs to reauthenticate
    if (!jwtLogic.verifyDate(authData.exp)) {
        const onReauthed = () => {
            executeRequest();
            socket.on("reauthenticated", onReauthed);
        };

        //Buffer the message to only execute when reauthenticated
        socket.on("reauthenticated", onReauthed);
        return socket.sendType("reauthenticate-request", null);
    }

    executeRequest();
};

router.get("/connect", authenticate(jwtLogic, true), WsConnect(wsRoute, (socket: WsExtended, req: Request) => {
    const authData = req.auth;
    const userData = authData.data;

    limiter(socket);

    //Generate new tokens for the client
    socket.on("reauthenticate-response", async (token: string) => {
        let tokens = null;
        try {
            tokens = await jwtLogic.signAccess({ username: userData.username }, token, true);
        } catch (err) {
            return console.log(err);
        }

        //Set the authData experation data to the current token experation date
        try {
            const data = await jwtLogic.verifyAccess(tokens.access);
            authData.exp = data.exp;
        } catch (err) {
            return console.log(err);
        }

        socket.emit("reauthenticated");
        //Respond to the client with their new tokens
        socket.sendType("reauthenticate-response", tokens);
    });

    socket.on("user-message", (text: string) => handleAuthenticatedRequest(
        socket,
        authData,
        () => chatLogic.SendMessage({
            username: userData.username,
            text: text
        })
    ));

    const handleMessage = (message: IMessage) => handleAuthenticatedRequest(
        socket,
        authData,
        () => socket.sendType("user-message", message)
    );

    chatLogic.ListenForMessages(handleMessage);

    socket.on("close", () => {
        chatLogic.StopListeningForMessages(handleMessage);
    });
}));

export default router; 