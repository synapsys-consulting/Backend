/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as ProductsController from "../controllers/product.controller";
//import { ensureAuth } from "../middleware/authenticated.middleware";


/**
 * Router Definition
 */
export const productsRouter = express.Router();
/**
 * Controller Definitions
 */
//productsRouter.get("/getProducts", ensureAuth, ProductsController.getProducts);

productsRouter.get("/getProducts", ProductsController.getProducts);
productsRouter.get('/image/products/:imageFile', ProductsController.getImageFile);
productsRouter.get("/getTaxType", ProductsController.getTaxType);
productsRouter.get("/getUnitType", ProductsController.getUnitType);
productsRouter.get("/getProviders", ProductsController.getProviders);
productsRouter.get("/getPartners", ProductsController.getPartners);
productsRouter.get("/getProductTypes/:id", ProductsController.getProductTypes);
productsRouter.post("/saveNewProduct", ProductsController.saveNewProduct);

