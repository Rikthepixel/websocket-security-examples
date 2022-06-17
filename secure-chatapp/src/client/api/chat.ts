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

export const ConnectWs = (access: string, onUserMsg: (msg: IMessage) => void) => {
    const ws = new WebSocket(`wss://localhost:3001/api/chat/connect?token=${access}`);
    ws.onopen = () => {

    };

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "user-message") {
            onUserMsg(data.args);
        }
    };

    return ws;
};