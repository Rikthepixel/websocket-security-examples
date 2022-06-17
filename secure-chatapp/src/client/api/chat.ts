import axios from "axios";
import { IChatlogResponse, IMessage } from '../models/ChatModels';

export const getChatlog = async (accessToken: string) => {
    return new Promise<IMessage[]>((res, rej) => {
        axios.get("https://localhost:3001/api/chat/chatlog", {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            const data = response.data as IChatlogResponse;
            res(data.messages);
        }).catch((err) => rej(err?.response?.data || err.message));
    });
};

export const ConnectWs = (access: string, onUserMsg: (msg: IMessage) => void, getRefresh: () => string, reauth: (access: string, refresh: string) => void) => {
    const ws = new WebSocket(`wss://localhost:3001/api/chat/connect?token=${access}`);

    ws.onmessage = (msg) => {
        const { type, args } = JSON.parse(msg.data);

        if (type === "user-message") {
            onUserMsg(args);
        }
        if (type === "reauthenticate-request") {
            ws.send(JSON.stringify({
                type: "reauthenticate-response",
                args: getRefresh()
            }));
        }
        if (type === "reauthenticat-response") {
            reauth(args.access, args.refresh);
        }
    };

    return ws;
};