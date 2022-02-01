import { Request, Response } from "express";
import * as Fs from "fs";
import * as Path from "path";
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
export async function getImageFile (req: Request, res: Response): Promise<void> {
    const imageFile = req.params.imageFile;
	const path_file = './images/products/' + imageFile;

    Fs.access(path_file, Fs.constants.R_OK, err => {
        if (err) {
            console.log('El paht de la imagen es: ' + path_file);
            res.status(200).send({message: 'No existe la imagen...'});
        } else {
            res.sendFile(Path.resolve(path_file));
        }
    });
}