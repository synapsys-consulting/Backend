"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const angel_model_1 = require("../models/angel.model");
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const valueId = parseInt(req.params.id);
        const newNombre = req.body.nombre;
        const newUser = {
            nombre: newNombre
        };
        if (!req.body) {
            res.status(400).send({ "message": "El contenido del cuerpo no puede estar vacío" });
        }
        else {
            try {
                const [numberOfAffectedRows, [UsersUpdated]] = yield angel_model_1.Angel.update(newUser, { where: { id: valueId }, returning: true });
                if (numberOfAffectedRows === 0) {
                    res.status(500).send({ message: "El usuario no existe en la Base de Datos." });
                }
                else {
                    //res.status(200).send({ numberOfAffectedRows, updatedUsers });
                    res.status(200).send({ "message": "El usuario se ha actualizado correctamente." });
                }
            }
            catch (err) {
                res.status(500).send({ "message": err + ". Se ha producido un error al intentar actualizar el usuario." });
            }
        }
    });
}
exports.update = update;
