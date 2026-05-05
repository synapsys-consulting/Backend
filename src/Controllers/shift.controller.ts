import { Request, Response } from "express";
import { getQuery } from "../models/queriesLoader";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";
import { Shift } from "../models/shift.model";

export async function getShifts (req: Request, res: Response): Promise<void> {
    const partner_id : number = parseInt(req.params.partnerId, 10);


    console.log('El valor de partner_id es: ' + partner_id.toString());

    sequelize.query(
        getQuery('GTSHIFTS'),
        {
            bind: [partner_id],
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        if (data) {
            res.status(200).send({ data });
        } else {
            res.status(404).send({ "message": "No existen turnos para el usuario"});
        }
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los turnos.'});
    });
}
export async function createShift (req: Request, res: Response): Promise<void> {

    const shift_name: string = req.body.shift_name;
    const shift_desc: string = req.body.shift_desc;
    const shift_hour_start: string = req.body.shift_hour_start;
    const shift_hour_end: string = req.body.shift_hour_end;
    const day_type: string = req.body.day_type;
    const user_create_id: number = parseInt(req.body.user_id);
    const partner_id : number = parseInt(req.body.partnerId, 10);
    const partner_name: string = req.body.partnerName;
    const newFecha = new Date();

    console.log(req.body);

    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"})
    } else {
        try {
            await Shift.create({
                shift_name: shift_name,
                shift_desc: shift_desc,
                shift_hour_start: shift_hour_start,
                shift_hour_end: shift_hour_end,
                day_type: day_type,
                status_id: "A",
                status_date: newFecha,
                eff_date: newFecha,
                exp_date: newFecha,
                user_create_id: user_create_id,
                user_modify_id: user_create_id,
                partner_id: partner_id,
                partner_name: partner_name,
                scenario: "APP",
            });
            // We leverage getting the whole data from the database
            sequelize.query(
                getQuery('GTSHIFTS'),
                {
                    bind: [partner_id],
                    raw: true,
                    type: QueryTypes.SELECT
                }
            )
            .then ( data => {
                if (data) {
                    res.status(200).send({ data });
                } else {
                    res.status(404).send({ "message": "No existen turnos para el usuario"});
                }
            })
            .catch ( err => {
                res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los turnos.'});
            });
        } catch (error) {
            console.log (error);
            res.status(500).send({message: error || " . Ocurrió un error mientras se grababa el turno. Inténtelo de nuevo pasados unos minutos."});
        }
    }
}

export async function deleteShift(req: Request, res: Response): Promise<void> {
    const shift_id: number = parseInt(req.params.shift_id);

    Shift.destroy({
        where: { shift_id: shift_id }
    })
    .then ( data => {
        if (data) {
            res.status(200).send({ "message": "El turno ha sido eliminado correctamente."});
        } else {
            res.status(404).send({ "message": "No se ha podido eliminar el turno."});
        }
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al eliminar el turno.'});
    });
}

export async function updateShift (req: Request, res: Response): Promise<void> {
    const shift_id = req.params.shift_id;
    const shift_name: string = req.body.shift_name;
    const shift_desc: string = req.body.shift_desc;
    const shift_hour_start: string = req.body.shift_hour_start;
    const shift_hour_end: string = req.body.shift_hour_end;
    const day_type: string = req.body.day_type;
    const user_create_id: number = parseInt(req.body.user_id);
    const partner_id : number = parseInt(req.body.partnerId, 10);
    const partner_name: string = req.body.partnerName;
    const newFecha = new Date();
    const newDefaultAddress = {
        shift_name: shift_name,
        shift_desc: shift_desc,
        shift_hour_start: shift_hour_start,
        shift_hour_end: shift_hour_end,
        day_type: day_type,
        status_id: "A",
        status_date: newFecha,
        eff_date: newFecha,
        exp_date: newFecha,
        user_create_id: user_create_id,
        user_modify_id: user_create_id,
        partner_id: partner_id,
        partner_name: partner_name,
        scenario: "APP"
    }
    console.log('El valor de shift_id es: ' + shift_id.toString());

    const transaction = await sequelize.transaction();
    try {
        await Shift.update(newDefaultAddress, { where: { shift_id: shift_id } });
        await transaction.commit();
        res.status(200).send({ message: "El turno ha sido actualizado correctamente."});
    } catch (error) {
        await transaction.rollback();
        res.status(500).send({ message: error || " . Ocurrió un error mientras se actualizaba el turno. Inténtelo de nuevo pasados unos minutos."});
    }
}