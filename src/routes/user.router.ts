/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as UsersController from "../controllers/user.controller";


/**
 * Router Definition
 */
export const usersRouter = express.Router();
/**
 * Controller Definitions
 */
usersRouter.get("/probando-controlador", UsersController.pruebas);
usersRouter.post("/login", UsersController.loginUserWithPersoneId);
usersRouter.post("/loginWithoutPass", UsersController.loginWithoutPass);
usersRouter.post("/register", UsersController.saveUserWithPersoneId);
usersRouter.put("/updateUser/:id", UsersController.updateUser);
usersRouter.put("/updateUserWithPersoneId/:id", UsersController.updateUserWithPersoneId);
usersRouter.delete("/deleteUser/:id", UsersController.deleteUser);
usersRouter.put("/changePassword/:id", UsersController.changePassword);
usersRouter.put("/changePasswordWithPersoneId/:id", UsersController.changePasswordWithPersoneId);