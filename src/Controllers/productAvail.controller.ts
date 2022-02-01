import { Request, Response } from "express";
import * as Querys from "../models/queries.model";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";

export async function getProductsAvail (req: Request, res: Response): Promise<void> {
    sequelize.query(
        Querys.queryGetProductsAvailable(),
        {
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        res.send({ products: data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los productos.'});
    });
}
export async function getProductsAvailWithPartnerId (req: Request, res: Response): Promise<void> {
    const partnerId: number = parseInt(req.params.id);
    sequelize.query(
        Querys.queryGetProductsAvailableWithPartnerId(),
        {
            bind: [partnerId],
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        res.status(200).send({ products: data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los productos.'});
    });
}
export async function getProductsAvailWithOutPartnerId (req: Request, res: Response): Promise<void> {
    sequelize.query(
        Querys.queryGetProductsAvailableWithOutPartnerId(),
        {
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        res.status(200).send({ products: data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los productos.'});
    });
}
export async function getProductAvailWithProductId (req: Request, res: Response): Promise<void> {
    const productId: number = parseInt(req.params.id);
    sequelize.query(
        Querys.getProductAvailWithProductId(),
        {
            bind: [productId],
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        res.status(200).send({ products: data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los productos.'});
    });
}
