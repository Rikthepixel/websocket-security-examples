import { Router } from 'express';
import { sendError } from '../utils/Sender';
import { jwtLogic, userLogic } from '../logic';
import authenticate from '../middleware/authenticate';

const router = Router();

const genTokens = async (username: string) => {
    const tokenData = { username };
    const refresh = await jwtLogic.signRefresh(tokenData);
    const { accessToken } = await jwtLogic.signAccess(tokenData, refresh);
    return {
        access: accessToken,
        refresh: refresh
    };
};

router.post("/register", async (req, res) => {
    let success = false;
    try {
        success = await userLogic.AddUser(
            req.body.username,
            req.body.password
        );
    } catch (error) {
        sendError(res, error);
    }

    res.send({
        result: success,
        message: success ? "Succesfully registered" : "Registration failed"
    });
});

router.post("/login", async (req, res) => {
    let [success, userData] = [false, null];

    try {
        const result = await userLogic.LoginUser(
            req.body?.username,
            req.body?.password
        );
        success = result.success,
            userData = result.userData;
    } catch (error) {
        sendError(res, error);
    }

    let tokens;
    try {
        tokens = success ? await genTokens(userData.username) : null;
    } catch (error) {
        return sendError(res, error);
    }

    res.send({
        result: success,
        tokens: tokens,
        message: success ? "Succesfully logged-in" : "Failed to log-in"
    });
});

router.post("/refresh", async (req, res) => {
    const refreshToken = req.body.token;
    let jwt = null;
    try {
        jwt = await jwtLogic.verifyRefresh(req.body.token);
    }
    catch (e) {
        return sendError(res, e);
    }

    let signedTokens = null;
    try {
        signedTokens = await jwtLogic.signAccess(
            jwt.body["data"],
            refreshToken,
            true
        );
    } catch (e) {
        return sendError(res, e);
    }

    res.send(signedTokens);
});

export default router; 