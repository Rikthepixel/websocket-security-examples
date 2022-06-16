import EventEmitter from 'events';

interface IMessage {
    username: string,
    text: string;
}

export default class ChatLogic {
    private chatlog: IMessage[] = [];
    private emitter: EventEmitter = new EventEmitter();

    public GetChatlog = () => this.chatlog;

    public ListenForMessages = (callback: (msg: IMessage) => void) => {
        this.emitter.on("message-sent", (message: IMessage) => {
            callback(message);
        });
    };

    public SendMessage = (msg: IMessage) => {
        this.emitter.emit("message-sent", msg);
        this.chatlog.push(msg);
    };
}