export interface ILoginResponse {
    result: boolean,
    tokens: { access: string, refresh: string; } | null;
    message: string;
}

export interface IRegisterResponse {
    result: boolean,
    message: string;
}

export interface IRefreshResponse {
    access: string,
    refresh: string;
}