/**
 * Required External Modules and Interfaces
 */
 import express from "express";
 import * as PurchaseController from "../controllers/purchase.controller";

 /**
 * Router Definition
 */
export const purchaseRouter = express.Router();

purchaseRouter.post("/savePurchasedProducts", PurchaseController.savePurchasedProducts);
purchaseRouter.get("/getPurchaseByUserId/:id", PurchaseController.getPurchaseByUserId);
purchaseRouter.get("/getPurchaseLinesByOrderId/:userId/:orderId/:providerName", PurchaseController.getPurchaseLinesByOrderId);
purchaseRouter.put("/purchaseStateTransition/:orderId/:providerName", PurchaseController.purchaseStateTransition);
purchaseRouter.put("/purchaseLineStateTransition/:orderId/:providerName", PurchaseController.purchaseLineStateTransition);
purchaseRouter.put("/modifyPurchaseLine/:orderId/:providerName", PurchaseController.modifyPurchaseLine);