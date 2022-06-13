export class AuthService {
    isValid = (token) => {
        const tokenData = JSON.parse(token);
        if (typeof (tokenData?.experationDate) !== "number") return false;
        return tokenData.experationDate < Date.now();
    };

    isDateValid = (date) => {
        return date < Date.now();
    };

    getTokenData = (token) => {
        return JSON.parse(token);
    };

    createToken = (username, experationTime) => {
        return JSON.stringify({
            username: username,
            experationDate: Date.now() + experationTime
        });
    };
}