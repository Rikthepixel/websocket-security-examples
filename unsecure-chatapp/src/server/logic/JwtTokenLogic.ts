import * as jwt from "njwt";
import Thrower, { ThrowBadRequest, ThrowServer } from '../utils/Thrower';

interface JwtTokenConfig {
    tokenSecret: string;
    refreshSecret: string;
    tokenValidityWindow: number;
    refreshValidityWindow: number;
    issuer?: string;
}

interface JwtData {
    [key: string]: any;
}

export default class JwtTokenLogic {
    private tokenValidityWindow: number;
    private refreshValidityWindow: number;
    private issuer: string;
    private tokenSecret: string;
    private refreshSecret: string;

    private validRefreshTokens: string[] = [];

    constructor(config: JwtTokenConfig) {
        this.issuer = config.issuer ?? "JwtTokenLogic";
        this.tokenValidityWindow = config.tokenValidityWindow;
        this.refreshValidityWindow = config.tokenValidityWindow;

        this.tokenSecret = config.tokenSecret;
        this.refreshSecret = config.refreshSecret;
    };

    verifyDate = (date: number) => {
        return date < Date.now();
    };

    verifyAccess = async (tokenString: string): Promise<JwtData> => {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.verify(tokenString, this.tokenSecret);
                return resolve(token.body);
            } catch (e) {
                return reject(e);
            }
        });
    };

    signAccess = async <T extends JwtData>(data: T, refreshToken: string, refresh: boolean = false): Promise<{ accessToken: string, refreshToken: string; }> => {
        return new Promise(async (resolve, reject) => {
            const refreshData = await this.verifyRefresh(refreshToken);
            if (!refreshData) return ThrowServer();

            let token;

            console.log("Hi");

            try {
                token = jwt.create(
                    {
                        data: data
                    },
                    this.tokenSecret
                );
            } catch (e) {
                return ThrowServer();
            }

            token.setExpiration(Date.now() + this.tokenValidityWindow);
            token.setIssuedAt(Date.now());
            token.setIssuer(this.issuer);

            if (refresh) {
                const index = this.validRefreshTokens.indexOf(refreshToken);
                if (index === -1) Thrower("403", "Invalid refresh token");
                refreshData.setExpiration(Date.now() + this.refreshValidityWindow);
                refreshData.setSigningKey(this.refreshSecret);
                refreshToken = refreshData.compact();
                delete this.validRefreshTokens[index];
            }

            resolve({
                accessToken: token.compact(),
                refreshToken: refreshToken
            });
        });
    };

    verifyRefresh = async (tokenString: string): Promise<jwt.Jwt> => {
        return new Promise((resolve) => {
            const index = this.validRefreshTokens.indexOf(tokenString);
            if (index === -1)
                return Thrower("403", "Invalid refresh token");

            try {
                return resolve(jwt.verify(tokenString, this.refreshSecret));
            } catch (e) {
                this.invalidateRefresh(tokenString);
                return Thrower("403", e.message);
            }
        });
    };

    invalidateRefresh = async (token: string) => {
        const index = this.validRefreshTokens.indexOf(token);
        if (index === -1) return true;
        delete this.validRefreshTokens[index];
    };

    signRefresh = async <T extends JwtData>(data: T): Promise<string> => {
        return new Promise((resolve, reject) => {
            let token;

            try {
                token = jwt.create(
                    {
                        data: data
                    },
                    this.refreshSecret
                );
            } catch (e) {
                return ThrowServer();
            }

            token.setExpiration(Date.now() + this.refreshValidityWindow);
            token.setIssuedAt(Date.now());
            token.setIssuer(this.issuer);

            const refreshToken = token.compact();
            this.validRefreshTokens.push(refreshToken);
            resolve(refreshToken);
        });
    };

}