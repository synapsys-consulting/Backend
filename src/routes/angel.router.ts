/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as AngelController from "../Controllers/angel.controller";

/**
 * Router Definition
 */
export const angelsRouter = express.Router();
/**
 * Controller Definitions
 */
//angelsRouter.get("/probando-controlador", AngelController.pruebas);
angelsRouter.put("/update/:id", AngelController.update);
//angelsRouter.post("/register", AngelController.saveUser);