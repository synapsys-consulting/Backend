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
usersRouter.post("/login", UsersController.loginUser);
usersRouter.post("/register", UsersController.saveUser);
usersRouter.put("/updateUser/:id", UsersController.updateUser);
usersRouter.delete("/deleteUser/:id", UsersController.deleteUser);
usersRouter.put("/changePassword/:id", UsersController.changePassword);