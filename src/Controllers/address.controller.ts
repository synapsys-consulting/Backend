import { Request, Response } from "express";
import { getQuery } from "../models/queriesLoader";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";
import { Address } from "../models/address.model";

export async function getDefaultLogisticAddress (req: Request, res: Response): Promise<void> {
    const user_id: number = parseInt(req.params.id);
    console.log('El valor de user_id es: ' + user_id.toString());

    sequelize.query(
        getQuery('GTDFLOGAD'),
        {
            bind: [user_id],
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        if (data) {
            res.status(200).send({ data });
        } else {
            res.status(404).send({ "message": "No existe dirección de reparto para el usuario"});
        }
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar la dirección.'});
    });
}

export async function getLogisticAdresses(req: Request, res: Response): Promise<void> {
    const personeId: number = parseInt(req.params.id);
    try {
        const data = await sequelize.query(
            getQuery('GTADDRS'),
            {
                bind: [personeId],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        if (data) {
            res.status(200).send({ data });
        } else {
            res.status(404).send({ "message": "No existen direcciones logísticas almacenadas para el usuario"});
        }
    } catch (err) {
        res.status(500).send({ message: err + ' .Ha ocurrido un error al recuperar las direcciones.'});
    }
}

export async function saveLogisticAddress (req: Request, res: Response): Promise<void> {
    const streetName: string = req.body.street_name;
    const streetNumber: string = req.body.street_number;
    const flatDoor: string = req.body.flat_door;
    const postalCode: string = req.body.postal_code;
    const locality: string = req.body.locality;
    const country: string = req.body.country;
    const optional: string = req.body.optional;
    const personeId: number = parseInt(req.body.persone_id);
    const userId: number = parseInt(req.body.user_id);
    const newFecha = new Date();

    console.log(req.body);

    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"})
    } else {
        try {
            const address = await Address.findOne({
                where: { addr_object: personeId }
            });
            if (address) {
                // There is more addresses for the user
                const createdAddress: Address = await Address.create({
                    addr_type: "L",     // L: Logistic, F: Fiscal
                    addr_object: personeId,
                    object_type: "C",    // C: Customer, P: Company
                    addr_street: streetName,
                    addr_number: streetNumber,
                    addr_complement: flatDoor,
                    city: locality,
                    country: country,
                    addr_zip_code: postalCode,
                    indication: optional,
                    status_date: newFecha,
                    user_create_id: userId,
                    scenario: "APP",
                    status_id: "A"      // D: Default A: Active B: Unactive I: Initial
                });
                const resulAddress = {
                    "ADDR_ID": createdAddress.addr_id,
                    "ADDR_STREET": createdAddress.addr_street,
                    "ADDR_NUMBER": createdAddress.addr_number,
                    "ADDR_COMPLEMENT": createdAddress.addr_complement,
                    "SUBURB": createdAddress.suburb,
                    "DISTRICT": createdAddress.district,
                    "CITY": createdAddress.city,
                    "PROVINCE": createdAddress.province,
                    "STATE": createdAddress.state,
                    "COUNTRY": createdAddress.country,
                    "ADDR_ZIP_CODE": createdAddress.addr_zip_code,
                    "INDICATION": createdAddress.indication,
                    "STATUS_ID": createdAddress.status_id
                }
                res.status(200).send({address : resulAddress});
            } else {
                // The first addres for the user.
                const createdAddress: Address = await Address.create({
                    addr_type: "L",     // L: Logistic, F: Fiscal
                    addr_object: personeId,
                    object_type: "C",    // C: Customer, P: Company
                    addr_street: streetName,
                    addr_number: streetNumber,
                    addr_complement: flatDoor,
                    city: locality,
                    country: country,
                    addr_zip_code: postalCode,
                    indication: optional,
                    status_date: newFecha,
                    user_create_id: userId,
                    scenario: "APP",
                    status_id: "D"      // D: Default A: Active B: Unactive I: Initial
                });
                const resulAddress = {
                    "ADDR_ID": createdAddress.addr_id,
                    "ADDR_STREET": createdAddress.addr_street,
                    "ADDR_NUMBER": createdAddress.addr_number,
                    "ADDR_COMPLEMENT": createdAddress.addr_complement,
                    "SUBURB": createdAddress.suburb,
                    "DISTRICT": createdAddress.district,
                    "CITY": createdAddress.city,
                    "PROVINCE": createdAddress.province,
                    "STATE": createdAddress.state,
                    "COUNTRY": createdAddress.country,
                    "ADDR_ZIP_CODE": createdAddress.addr_zip_code,
                    "INDICATION": createdAddress.indication,
                    "STATUS_ID": createdAddress.status_id
                }
                res.status(200).send({address : resulAddress});
            }
        } catch (error) {
            console.log (error);
            res.status(500).send({message: error || " . Ocurrió un error mientrasse graba la dirección. Inténtelo de nuevo pasados unos minutos."});
        }
    }
}
export async function deleteAddress (req: Request, res: Response): Promise<void> {
    const addressId: number = parseInt(req.params.id);
    try {
        const num = await Address.destroy({ where: { addr_id: addressId }});
        if (num === 1) {
            res.status(200).send( { "message" : "La dirección fue borrada correctamente" } );
        } else {
            res.status(400).send( { "message": "No se borró la dirección. No se pudo encontrar en la base de datos."})
        }
    } catch (err) {
        console.log (err);
        res.status(500).send({message: err || " . Ocurrió un error mientras se borraba la dirección. Inténtelo de nuevo pasados unos minutos."});
    }
}
export async function updateAddress (req: Request, res: Response): Promise<void> {
    const addressId: number = parseInt(req.params.id);
    const defaultAddressId: number = parseInt(req.body.addr_id_default);
    const newFecha = new Date();
    const newDefaultAddress = {
        addr_type: req.body.addr_type,
        object_type: req.body.object_type,
        addr_street: req.body.addr_street,
        addr_number: req.body.addr_number,
        addr_complement: req.body.addr_complement,
        suburb: req.body.suburb,
        suburb_id: req.body.suburb_id,
        district: req.body.district,
        district_id: req.body.district_id,
        city: req.body.city,
        city_id: req.body.city_id,
        province: req.body.province,
        province_id: req.body.province_id,
        state: req.body.state,
        state_id: req.body.state_id,
        country: req.body.country,
        country_id: req.body.country_id,
        addr_gps: req.body.addr_gps,
        addr_zip_code: req.body.addr_zip_code,
        status_id: req.body.status_id,
        status_date: (req.body.status_id) ? newFecha : null,
        user_modify_id: req.body.user_id,
        alias: req.body.alias,
        indication: req.body.indication
    };
    const oldDefaultAddress = {
        addr_type: req.body.addr_type,
        object_type: req.body.object_type,
        addr_street: req.body.addr_street,
        addr_number: req.body.addr_number,
        addr_complement: req.body.addr_complement,
        suburb: req.body.suburb,
        suburb_id: req.body.suburb_id,
        district: req.body.district,
        district_id: req.body.district_id,
        city: req.body.city,
        city_id: req.body.city_id,
        province: req.body.province,
        province_id: req.body.province_id,
        state: req.body.state,
        state_id: req.body.state_id,
        country: req.body.country,
        country_id: req.body.country_id,
        addr_gps: req.body.addr_gps,
        addr_zip_code: req.body.addr_zip_code,
        status_id: 'A',
        status_date: (req.body.status_id) ? newFecha : null,
        user_modify_id: req.body.user_id,
        alias: req.body.alias,
        indication: req.body.indication
    }
    const transact = await sequelize.transaction();
    try {
        // First update the old deafault Address: status_id = 'A'
        const updatedOldDefaulAddress = await Address.update (
            oldDefaultAddress, 
            { 
                where: { 
                    addr_id: defaultAddressId 
                }, 
                transaction: transact,
                returning: true
            }
        );
        console.log('El valor de retorno es: ' + updatedOldDefaulAddress[0]);
        // Second update the new deafault Address: status_id = 'D'
        const updatedNewDefaultAddress = await Address.update (
            newDefaultAddress,
            { 
                where: { 
                    addr_id: addressId 
                },
                transaction: transact,
                returning: true 
            }
        );
        console.log('El valor de retorno es: ' + updatedNewDefaultAddress[0]);
        if (updatedNewDefaultAddress[0] === 0 || updatedOldDefaulAddress[0] === 0) {
            transact.rollback();
            res.status(404).send({ "message": "No se pudo actualizar la dirección ya que no se encontró la dirección en la base de datos." });
        } else {
            transact.commit();
            res.status(200).send({ "usuariosActualizados": updatedNewDefaultAddress[1] });
        }
    } catch (err) {
        transact.rollback();
        console.log (err);
        res.status(500).send({message: err || " . Ocurrió un error mientras se actualizaba la dirección. Inténtelo de nuevo pasados unos minutos."});
    }
}