import EventEmitter from 'events';

export interface IMessage {
    username: string,
    text: string;
}

export default class ChatLogic {
    private chatlog: IMessage[] = [
        {
            username: "Rik",
            text: "Hellow"
        }
    ];
    private emitter: EventEmitter = new EventEmitter();

    public GetChatlog = () => this.chatlog;

    public ListenForMessages = (callback: (msg: IMessage) => void) => {
        this.emitter.on("message-sent", callback);
    };

    public StopListeningForMessages = (callback: (msg: IMessage) => void) => {
        this.emitter.off("message-sent", callback);
    };

    public SendMessage = (msg: IMessage) => {
        this.emitter.emit("message-sent", msg);
        this.chatlog.push(msg);
    };
}