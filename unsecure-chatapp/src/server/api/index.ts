import { Router } from 'express';
import UserController from "./UserController";
import ChatController from "./ChatController";

const router = Router();

router.use("/chat", ChatController);
router.use("/users", UserController);

export default router;