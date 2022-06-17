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
    private listeners: ((...any) => any)[] = [];
    private emitter: EventEmitter = new EventEmitter();

    public GetChatlog = () => this.chatlog;

    public ListenForMessages = (callback: (msg: IMessage) => void) => {
        this.listeners.push(callback);
    };

    public StopListeningForMessages = (callback: (msg: IMessage) => void) => {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            delete this.listeners[index];
        }
    };

    public SendMessage = (msg: IMessage) => {
        this.listeners.forEach(listener => {
            listener(msg);
        });
        this.chatlog.push(msg);
    };
}