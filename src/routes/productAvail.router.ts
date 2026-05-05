/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as ProductsAvailController from "../controllers/productAvail.controller";
//import { ensureAuth } from "../middleware/authenticated.middleware";

/**
 * Router Definition
 */
export const productsAvailRouter = express.Router();

/**
 * Controller Definitions
 */

 //productsRouter.get("/getProductsAvail", ensureAuth, ProductsAvailController.getProductsAvail);

 productsAvailRouter.get("/getProductsAvail", ProductsAvailController.getProductsAvail);
 productsAvailRouter.get("/getProductsAvailWithPartnerId/:id", ProductsAvailController.getProductsAvailWithPartnerId);
 productsAvailRouter.get("/getProductsAvailWithOutPartnerId", ProductsAvailController.getProductsAvailWithOutPartnerId);
 productsAvailRouter.get("/getProductAvailWithProductId/:id", ProductsAvailController.getProductAvailWithProductId);
