import { Request, Response } from "express";
//import { Product } from "../models/product.model";
//import { ProductCategory } from "../models/productCategory.model";
import * as Querys from "../models/queries.model";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";

export async function getProducts (req: Request, res: Response): Promise<void> {
    sequelize.query(
        Querys.getProducts(),
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