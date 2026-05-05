import express from "express";
import * as ShiftController from "../controllers/shift.controller";

/**
 * Router Definition
 */
export const shiftRouter = express.Router();

shiftRouter.get("/getShifts/:partnerId", ShiftController.getShifts);
shiftRouter.post("/createShift", ShiftController.createShift);
shiftRouter.delete("/deleteShift/:shift_id", ShiftController.deleteShift);
shiftRouter.put("/updateShift/:shift_id", ShiftController.updateShift);
