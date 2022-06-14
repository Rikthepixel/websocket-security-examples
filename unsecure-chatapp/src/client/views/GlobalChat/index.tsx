import React, { useState } from 'react';
import Textarea from "react-textarea-autosize";
import PageHeader from '../../components/PageHeader';
import "./style.scss";

const GlobalChat = () => {
    const [inputText, setInputText] = useState("");

    return (
        <div className="gc">
            <PageHeader className="header">Chat</PageHeader>
            <div className="chat-container">

            </div>
            <div className="user-control">
                <div className="input-container">
                    <div style={{ display: inputText?.length < 1 ? "block" : "none" }} className="placeholder">Enter a message</div>
                    <Textarea
                        role="input"
                        spellCheck
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        maxRows={6}
                    />
                </div>
                <button>
                    Send
                </button>
            </div>
        </div >
    );
};

export default GlobalChat;