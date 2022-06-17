import React, { useCallback, useEffect, useRef, useState } from 'react';
import Textarea from "react-textarea-autosize";
import { ConnectWs, getChatlog } from '../../api/chat';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Message from '../../components/Message';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { IMessage } from '../../models/ChatModels';
import hasToRefresh from '../../utils/hasToRefresh';
import "./style.scss";

const GlobalChat = () => {

    const [auth, setAuth, refresh] = useAuth();
    const ws = useRef<WebSocket>();
    const [inputText, setInputText] = useState("");
    const messagesRef = useRef<IMessage[]>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    messagesRef.current = messages;

    const sendMsg = useCallback(() => {
        if (inputText.length < 1) return;
        if (!ws.current) return;

        ws.current.send(JSON.stringify({
            type: "user-message",
            args: inputText
        }));
        setInputText("");

    }, [ws.current, inputText]);

    useEffect(() => {
        if (!auth.loggedIn) return;

        getChatlog(auth.access)
            .then(async (messages) => {
                setMessages(messages);
                const connectToSocket = () => {
                    ws.current = ConnectWs(
                        auth.access,
                        (msg) => setMessages([
                            ...messagesRef.current,
                            msg
                        ]),
                        () => auth.access,
                        (access, refresh) => setAuth({
                            loggedIn: true,
                            username: auth.username,
                            access: access,
                            refresh: refresh
                        })
                    );
                };
                if (ws.current) {
                    ws.current.onclose = () => {
                        ws.current.close();
                        ws.current = null;
                        connectToSocket();
                    };
                } else {
                    connectToSocket();
                }
            }).catch((err) => {
                if (hasToRefresh(err)) {
                    refresh();
                }
            });

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current.onclose = () => {
                    ws.current = null;
                };
            }
        };
    }, []);

    return (
        <div className="gc">
            <Navbar title="Chat" />
            <div className="chat-container">
                {messages.map((message, index) => {
                    return <Message
                        key={index}
                        username={message.username}
                        text={message.text}
                        isOwn={message.username === auth.username}
                    />;
                })}
            </div>
            <div className="user-control">
                <InputGroup>
                    <Textarea
                        placeholder="Enter a message"
                        role="input"
                        spellCheck
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        maxRows={6}
                    />
                </InputGroup>
                <Button onClick={sendMsg}>
                    Send
                </Button>
            </div>
        </div >
    );
};

export default GlobalChat;