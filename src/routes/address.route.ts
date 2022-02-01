/**
 * Required External Modules and Interfaces
 */
 import express from "express";
 import * as AddressController from "../controllers/address.controller";

 /**
 * Router Definition
 */
export const addressRouter = express.Router();

/**
 * Controller Definitions
 */

 addressRouter.get("/getDefaultLogisticAddress/:id", AddressController.getDefaultLogisticAddress);
 addressRouter.get("/getLogisticAdresses/:id", AddressController.getLogisticAdresses);
 addressRouter.post("/saveLogisticAddress", AddressController.saveLogisticAddress);
 addressRouter.put("/updateAddress/:id", AddressController.updateAddress);
 addressRouter.delete("/deleteAddress/:id", AddressController.deleteAddress);
