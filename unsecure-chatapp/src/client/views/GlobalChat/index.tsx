import React, { useEffect, useRef, useState } from 'react';
import Textarea from "react-textarea-autosize";
import { getChatlog } from '../../api/chat';
import { refreshTokens } from '../../api/user';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Message from '../../components/Message';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { IMessage } from '../../models/ChatModels';
import hasToRefresh from '../../utils/hasToRefresh';
import "./style.scss";

const GlobalChat = () => {

    const [auth, , refresh] = useAuth();
    const [inputText, setInputText] = useState("");
    const messagesRef = useRef<IMessage[]>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    messagesRef.current = messages;

    useEffect(() => {
        if (!auth.loggedIn) return;

        getChatlog(auth.access)
            .then((messages) => {
                setMessages(messages);
            })
            .catch((err) => {
                if (hasToRefresh(err)) {
                    refresh();
                }
            });
    }, [auth]);

    console.log(messages);

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
                <Button>
                    Send
                </Button>
            </div>
        </div >
    );
};

export default GlobalChat;