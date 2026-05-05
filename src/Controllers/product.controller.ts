import { Request, Response } from "express";
import * as Fs from "fs";
import * as Path from "path";
//import { Product } from "../models/product.model";
//import { ProductCategory } from "../models/productCategory.model";
import { getQuery } from "../models/queriesLoader";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";

export async function getProducts (req: Request, res: Response): Promise<void> {
    sequelize.query(
        getQuery('GETPROD'),
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
export async function getTaxType (req: Request, res: Response): Promise<void>{
    sequelize.query(
        getQuery('GTTAXTYPE'),
        {
            raw: true,
            type: QueryTypes.SELECT,
        }
    )
    .then( data => {
        res.send({ data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los tipos de tasas.'});
    });
}
export async function getUnitType (req: Request, res: Response): Promise<void>{
    sequelize.query(
        getQuery('GTUNITTYP'),
        {
            raw: true,
            type: QueryTypes.SELECT,
        }
    )
    .then( data => {
        res.send({ data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los tipos de unidades existentes.'});
    });
}
export async function getProviders (req: Request, res: Response): Promise<void> {
    sequelize.query(
        getQuery('GTPROVID'),
        {
            raw: true,
            type: QueryTypes.SELECT,
        }
    )
    .then(data => {
        res.send({ data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los proveedores.'});
    });
}
export async function getPartners (req: Request, res: Response): Promise<void> {
    sequelize.query(
        getQuery('GTPRTNRS'),
        {
            raw: true,
            type: QueryTypes.SELECT,
        }
    )
    .then(data => {
        res.send({ data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los partners.'});
    });
}
export async function getProductTypes (req: Request, res: Response): Promise<void> {
    const partnerId: number = parseInt(req.params.id);
    sequelize.query(
        getQuery('GTPRODTYP'),
        {
            bind: [partnerId],
            raw: true,
            type: QueryTypes.SELECT
        }
    )
    .then ( data => {
        res.status(200).send({ data });
    })
    .catch ( err => {
        res.status(500).send({ message: err.message + ' .Ha ocurrido un error al recuperar los tipos de productos.'});
    });
}
export async function saveNewProduct (req: Request, res: Response): Promise<void> {
    const productCategoryId: number = parseInt(req.body.productCategoryId, 10);
    const productName: String = req.body.productName;
    const minQuantitySell: number = parseInt(req.body.minQuantitySell, 10);
    const productPrice: number = parseInt(req.body.productPrice, 10);
    const discountType: String = req.body.discountType;
    const discountValue: number = parseFloat(req.body.discountValue);
    const taxType: String = req.body.taxType;
    const idUnit: String = req.body.idUnit;
    const weeksWarning: number = parseInt(req.body.weeksWarning, 10);
    const quantityMinPrice: number = parseInt(req.body.quantityMinPrice, 10);
    const quantityMaxPrice: number = parseInt(req.body.quantityMaxPrice, 10);
    const productType : String = req.body.productType;
    const persone_name : String = req.body.persone_name;
    const partnerId : number = parseInt(req.body.partnerId, 10);
    const partnerName: String = req.body.partnerName;
    const userCreatedId : number = parseInt(req.body.userCreatedId, 10);
    interface Product {
        PRODUCT_CATEGORY_ID: number;
        PRODUCT_NAME: string;
        MIN_QUANTITY_SELL: number;
        PRODUCT_PRICE: number;
        DISCOUNT_TYPE: string;
        DISCOUNT_VALUE: number;
        TAX_TYPE: string;
        ID_UNIT: number;
        WEEKS_WARNING:number;
        QUANTITY_MIN_PRICE: number;
        QUANTITY_MAX_PRICE: number;
        PRODUCT_TYPE: string;
        PERSONE_NAME: string;
        PARTNER_ID: number;
        PARTNER_NAME: string;
        USER_CREATE_ID: number;
    }
    interface ProductId {
        PRODUCT_ID: number;
        CURRENT_DAY: number;
    }
    // Get the last value for the sequence
    const queryNewProductSequence = getQuery('GTPRODSEQ');
    // Query wchich insert a row in the table KRC_PRODUCT
    const queryInsertNewProduct = getQuery('INSPROD');
    const transact = await sequelize.transaction();
    try {
        let productId = -1;
        let currentDay = 20000101;
        const resultado = <Array<ProductId>> await sequelize.query (
            queryNewProductSequence,
            {
                type: QueryTypes.SELECT,
            }
        );
        productId = resultado[0].PRODUCT_ID;
        currentDay = resultado[0].CURRENT_DAY;
    } catch (err) {
        console.log(err);
        transact.rollback();
        res.status(500).send({message: err || " . Ocurrió un error mientras que se creaba el producto." });
    }
}