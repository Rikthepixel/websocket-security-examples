import JwtTokenLogic from './JwtTokenLogic';
import UserLogic from './UserLogic';
import crypto from "crypto";
import ChatLogic from './ChatLogic';
import { cwd } from 'process';
import path from 'path';

const serverDir = path.join(__dirname, "../");
console.log(path.join(serverDir, "./data/users"));

export const userLogic = new UserLogic({
    storagePath: path.join(serverDir, "./data/users")
});

export const jwtLogic = new JwtTokenLogic({
    tokenSecret: crypto.randomBytes(64).toString("hex"),
    refreshSecret: crypto.randomBytes(64).toString("hex"),
    tokenValidityWindow: 600000, //10 minutes,
    refreshValidityWindow: 7200000 //2 hours
});

export const chatLogic = new ChatLogic();