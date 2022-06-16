export interface IMessage {
    username: string;
    text: string;
}

export interface IChatlogResponse {
    message: IMessage[];
}