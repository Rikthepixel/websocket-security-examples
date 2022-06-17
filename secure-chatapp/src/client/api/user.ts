import axios from "axios";
import { ILoginResponse, IRefreshResponse, IRegisterResponse } from '../models/AuthModels';
import hasToRefresh from '../utils/hasToRefresh';

export const loginUser = async (username: string, password: string) => {
    return new Promise((res, rej) => {
        axios.post("https://localhost:3001/api/users/login", {
            username: username,
            password: password
        }).then((response) => {

            const data = response.data as ILoginResponse;
            if (!data.result) return rej(data.message);
            const tokens = data.tokens;

            res({
                loggedIn: true,
                username: username,
                access: tokens.access,
                refresh: tokens.refresh,
            });

        }).catch((err) => rej(err.response.data));
    });
};

export const registerUser = async (username: string, password: string) => {
    return new Promise((res, rej) => {
        axios.post("https://localhost:3001/api/users/register", {
            username: username,
            password: password
        }).then((response) => {
            const data = response.data as IRegisterResponse;
            if (!data.result) return rej(data.message);
            res(data);
        }).catch((err) => rej(err.response.data));
    });
};

export const refreshTokens = async (refreshToken: string) => {
    return new Promise<IRefreshResponse>((res, rej) => {
        axios.post("https://localhost:3001/api/users/refresh", {
            data: {
                token: refreshToken
            }
        }).then((resp) => {
            res(resp.data as IRefreshResponse);
        }).catch((err) => {
            if (hasToRefresh(err.response.data)) {
                return rej({
                    relog: true
                });
            }
            rej(err.response.data);
        });
    });
};

export const logoutUser = async (refreshToken: string) => {
    return new Promise((res, rej) => {
        axios.delete("https://localhost:3001/api/users/logout", {
            data: {
                token: refreshToken
            }
        }).then(() => res({
            loggedIn: false,
            access: "",
            refresh: "",
            username: ""
        })).catch(rej);
    });
};