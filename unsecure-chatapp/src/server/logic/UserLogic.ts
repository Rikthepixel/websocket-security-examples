import { existsSync, mkdirSync, PathLike, writeFileSync } from 'fs';
import fs from "fs/promises";
import * as bcrypt from "bcrypt";
import Thrower, { ThrowBadRequest, ThrowServer } from '../utils/Thrower';

interface IUserLogicConfig {
    storagePath: PathLike;
}

interface IUserTable {
    [key: string]: string;
}

export default class UserLogic {
    private storageFile: PathLike;

    constructor(config: IUserLogicConfig) {
        this.storageFile = `${config.storagePath}/users.json`;

        mkdirSync(config.storagePath, { recursive: true });
        if (!existsSync(this.storageFile)) writeFileSync(this.storageFile, '{"admin":"$2b$10$SZj6mpCQYnVmc2dZow9bzuScUsmjkB1RvNSWBFP4FVnG2QQgQOh1S"}');
    }

    private getUserTable = async (): Promise<IUserTable> => {
        try {
            const file = await fs.open(this.storageFile, "r");
            const usersJSON = (await file.readFile()).toString();
            file.close();
            return JSON.parse(usersJSON);
        } catch {
            return ThrowServer();
        }
    };

    private saveUserTable = async (users: IUserTable): Promise<void> => {
        try {
            const file = await fs.open(this.storageFile, "w");
            await file.writeFile(JSON.stringify(users));
            await file.close();
        } catch {
            return ThrowServer();
        }
    };

    public GetUser = async (username: string) => {
        return (await this.getUserTable())[username];
    };

    public LoginUser = async (username: string, password: string) => {
        console.log(username);

        const user = await this.GetUser(username);
        if (typeof user !== "string") return ThrowBadRequest("User does not exist");

        return {
            success: await bcrypt.compare(password, user),
            userData: { username }
        };
    };

    public AddUser = async (username: string, password) => {
        const userTable = await this.getUserTable();
        const existingUser = userTable[username];
        if (typeof existingUser === "string") return ThrowBadRequest("User already exists");

        const hashedPassword = await bcrypt.hash(
            password, await bcrypt.genSalt()
        );

        userTable[username] = hashedPassword;
        await this.saveUserTable(userTable);
        return true;
    };
}