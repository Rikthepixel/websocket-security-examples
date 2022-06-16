const msgs = [
    "Jwt is expired",
    "Signature verification failed"
];

export default (msg: string) => {
    return msgs.includes(msg);
};