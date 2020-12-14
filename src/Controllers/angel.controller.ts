import { Request, Response } from "express";
import { Angel } from "../models/angel.model";

export async function update (req: Request, res: Response): Promise<void> {
    const valueId: number = parseInt(req.params.id);
    const newNombre: string = req.body.nombre;
    const newUser = {
        nombre: newNombre
    };
    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"});
    } else {
        try {
            const [numberOfAffectedRows, [UsersUpdated]]  = await Angel.update(newUser, { where: { id: valueId }, returning: true});
            if (numberOfAffectedRows === 0) {
                res.status(500).send({ message: "El usuario no existe en la Base de Datos." });
            } else {
                //res.status(200).send({ numberOfAffectedRows, updatedUsers });
                res.status(200).send({ "message": "El usuario se ha actualizado correctamente." });
            }
    
        } catch (err) {
            res.status(500).send({ "message": err + ". Se ha producido un error al intentar actualizar el usuario." });
        }
    }
}