import axios from "axios";
import { IChatlogResponse, IMessage } from '../models/ChatModels';

export const getChatlog = async (accessToken: string) => {
    return new Promise<IMessage[]>((res, rej) => {
        axios.get("http://localhost:3001/api/chat/chatlog", {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            console.log(response);

            const data = response.data as IChatlogResponse;
            res(data.message);
        }).catch((err) => rej(err?.response?.data || err.message));
    });
};