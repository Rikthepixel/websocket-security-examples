import React from 'react';
import "./style.scss";

interface IMessageProps {
    username: string,
    text: string,
    isOwn: boolean;
}

const Message = (props: IMessageProps) => {
    return (
        <div className='message' data-is-own={props.isOwn}>
            <div className='text-container'>
                <div className='user'>{props.username}</div>
                <div>{props.text}</div>
            </div>
        </div>
    );
};

export default Message;