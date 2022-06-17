import React, { Dispatch, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react";

interface IAuthState {
    loggedIn: boolean,
    username: string,
    access: string,
    refresh: string;
}

interface IRefresh {
    access: string;
    refresh: string;
}

interface IAuthProviderProps extends PropsWithChildren {
    refreshCall: (refreshToken: string) => Promise<IRefresh>;
    onLoginRequired: (auth: IAuthState) => void;
}
const storedState = sessionStorage.getItem("authState");
const initialState = storedState ? JSON.parse(storedState) as IAuthState : {
    loggedIn: false,
    username: "",
    access: "",
    refresh: ""
};
const authContext = React.createContext<[IAuthState, Dispatch<SetStateAction<IAuthState>>, () => void]>([initialState, (auth) => auth, () => null]);

export const useAuth = () => {
    return useContext(authContext);
};

export const AuthProvider = ({ children, refreshCall, onLoginRequired }: IAuthProviderProps) => {
    const [authState, setAuthState] = useState(initialState);

    useEffect(() => {
        sessionStorage.setItem("authState", JSON.stringify(authState));
    }, [authState]);

    const refresh = useCallback(() => {
        refreshCall(authState.refresh)
            .then(({ access, refresh }) => {
                setAuthState({
                    ...authState,
                    access: access,
                    refresh: refresh
                });
            })
            .catch(() => {
                setAuthState({
                    loggedIn: false,
                    username: "",
                    access: "",
                    refresh: ""
                });
                onLoginRequired(authState);
            });
    }, [authState]);

    return <authContext.Provider value={[authState, setAuthState, refresh]}>
        {children}
    </authContext.Provider>;
};