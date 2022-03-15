import jwtDecode from "jwt-decode";

const AUTH_TOKEN_NAME = "authToken";

export type AuthToken = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};

type JWTToken = {
    aud: string;
    exp: number;
    iat: number;
    nbf: number;
    jti: string;
    sub: string;
    scopes: [];
};

const Auth = {
    getToken: (): AuthToken => {
        const token = localStorage.getItem(AUTH_TOKEN_NAME);
        return token ? JSON.parse(token) : undefined;
    },
    setToken: (token: any) => {
        localStorage.setItem(AUTH_TOKEN_NAME, JSON.stringify(token));
    },
    deleteToken: () => {
        localStorage.removeItem(AUTH_TOKEN_NAME);
    },
    isNullToken: (token: AuthToken): boolean => {
        return !(typeof token === "object" && "accessToken" in token);
    },
    isExpiredToken: (token: AuthToken): boolean => {
        // convert javascript date to seconds
        const now = Date.now() / 1000;
        return (
            Auth.isNullToken(token) ||
            jwtDecode<JWTToken>(token.accessToken).exp <= now
        );
    },
    isAuthenticated: (): boolean => {
        const token = Auth.getToken();
        return !(Auth.isNullToken(token) || Auth.isExpiredToken(token));
    },
};

export default Auth;
