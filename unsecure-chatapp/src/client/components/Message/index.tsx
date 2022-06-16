import React from 'react';
import "./style.scss";

interface IMessageProps {
    username: string,
    text: string,
    isOwn: boolean;
}

const Message = (props: IMessageProps) => {
    return (
        <div data-is-own={props.isOwn}>
            {props.username}
            {props.text}
        </div>
    );
};

export default Message;