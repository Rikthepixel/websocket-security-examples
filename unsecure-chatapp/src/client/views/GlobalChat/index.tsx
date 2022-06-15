import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Textarea from "react-textarea-autosize";
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Navbar from '../../components/Navbar';
import "./style.scss";

const GlobalChat = () => {
    const [inputText, setInputText] = useState("");

    return (
        <div className="gc">
            <Navbar title="Chat" />
            <div className="chat-container">

            </div>
            <div className="user-control">
                <InputGroup>
                    <div style={{ display: inputText?.length < 1 ? "block" : "none" }} className="placeholder">Enter a message</div>
                    <Textarea
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