import { Router } from "express";
import { UserController } from "../Controller/UserController.js";

export function createUserRouter({ userModel }) {
    const userRouter = Router();
    const userController = new UserController({ userModel })

    userRouter.get("/", userController.getAll);
    userRouter.post("/:username", userController.getOneByUsername);
    userRouter.post("/create", userController.create);
    userRouter.post("/update/:userToUpdate", userController.update);
    userRouter.post("/login", userController.login);
    userRouter.post("/register", userController.create);
    userRouter.post("/logout", userController.logout);

    return userRouter;
}
