import { Request, Response } from "express";
import * as Querys from "../models/queries.model";
import { sequelize } from "../models/db.model";
import { QueryTypes } from "sequelize";
import * as nodemailer from "nodemailer";

export async function savePurchasedProducts (req: Request, res: Response): Promise<void> {
    interface PurchasedProduct {
        product_id: number;
        product_name: string;
        product_name_long: string;
        product_description?: string;
        product_type?: string;
        brand?: string;
        num_images?: number;
        num_videos?: number;
        purchased: number;
        product_price: number;
        total_before_discount: number;
        total_amount: number;
        discount_amount: number;
        tax_amount: number;
        persone_id: number;
        persone_name: string;
        email: string;
        tax_id: number;
        tax_apply: number;
        partner_id: number;
        partner_name: string;
        user_id: number;
    }
    interface OrderId {
        ORDER_ID: number,
        CURRENT_DAY: number
    }
    const purchasedProducts: PurchasedProduct[] = <Array<PurchasedProduct>>req.body.purchased_products;
    const setProviderPurchasedProductList = new Set<string>();  // contain the email of the different providers
    // Get the last value for the sequence
    const queryPurchaseSequence = Querys.queryPurchaseSequence();
    // Insert KRC_PURCHASE
    const queryInsertPurchased = Querys.queryInsertPurchased();
    // Mark the products that have been purchased in the KRC_PRODUCT_AVAIL table
    //const updateProductsAvail = Querys.updateProductsAvail();
    // Insert in the KRF_TRANSACTIONS table the products that have been marked in KRC_PRODUCT_AVAIL
    //const addMarkedPruductsToTransactions = Querys.addMarkedPruductsToTransactions();
    // Take the registrys that habe been inserted to return them to the client
	//const queryMarkedPruductsToTransactions = Querys.queryMarkedPruductsToTransactions();
    // Finally discount of KRC_PRODUCT_AVAIL the products which have been marked in the first step
	//const updateStockProductAvail = Querys.updateStockProductAvail();
    let someWasError = false;
    const transact = await sequelize.transaction();
    try {
        let orderId = -1;
        let currentDay = 20000101;
        const resultado = <Array<OrderId>> await sequelize.query (
            queryPurchaseSequence,
            {
                type: QueryTypes.SELECT,
            }
        );
        orderId = resultado[0].ORDER_ID;
        currentDay = resultado[0].CURRENT_DAY;
        const currentDayFormated = currentDay.toString().substr(6, 2) + "/" + currentDay.toString().substr(4, 2) + "/" + currentDay.toString().substr(0, 4);
        for (let index = 0; index < purchasedProducts.length; index++) {
            //const element: PurchasedProduct = purchasedProducts[index];
            const totalBeforeDiscount: number = purchasedProducts[index].purchased * purchasedProducts[index].total_before_discount;
            //const totalBeforeDiscountBase10000: number = totalBeforeDiscount*10000;
            const totalAmount: number = purchasedProducts[index].purchased * purchasedProducts[index].total_amount;
            //const totalAmountBase10000: number = totalAmount * 10000;
            const openAmount = 0;
            //const openAmountBase10000: number = openAmount * 10000;
            const discountAmount = purchasedProducts[index].purchased * purchasedProducts[index].discount_amount;
            //const discountAmountBase10000:number = discountAmount * 10000;
            const taxAmount: number = purchasedProducts[index].purchased * purchasedProducts[index].tax_amount;
            //const taxAmountBase10000: number = taxAmount * 10000;

            await sequelize.query(queryInsertPurchased,
                {
                    bind: [orderId, currentDay.toString() + '-' + ("00000" + orderId.toString()).slice(-5) + '-' + purchasedProducts[index].persone_name, 
                    purchasedProducts[index].persone_name, purchasedProducts[index].product_name, purchasedProducts[index].product_id,
                    purchasedProducts[index].purchased, purchasedProducts[index].product_price, totalBeforeDiscount, totalAmount, openAmount, discountAmount,
                    purchasedProducts[index].tax_id, taxAmount, purchasedProducts[index].user_id, purchasedProducts[index].partner_id, purchasedProducts[index].partner_name
                    ],
                    type: QueryTypes.INSERT,
                    transaction: transact
                }
            );
            // Process the different emails of the providers,
            // which we use to send an email to the different providers
            setProviderPurchasedProductList.add(purchasedProducts[index].email);    // add email to the collection
            console.log('El email del producto es: ' + purchasedProducts[index].email);
        }
        
        // Send the emails
        //const account = await nodemailer.createTestAccount();
        // Create a SMTP transporter object

        const transporter = nodemailer.createTransport({
            host: "mail.synapsys-consulting.com",
            port: 465,
            secure: true,
            auth: {
                user: 'info@synapsys-consulting.com',
                pass: 'info$2021'
//                user: 'angel.ruiz@synapsys-consulting.com',
//                pass: '895CxI.3007?Pi'
            }
        });
        console.log("He creado el transporter");
        transporter.verify(function (error, success) {
            if (error) {
                console.log (error);
                someWasError = true;
            } else {
                if (success) {
                    console.log("Server is ready to take our messages");
                    someWasError = false;
                }
            }
        });
        if (someWasError === false) {
            for (const item of setProviderPurchasedProductList) {
                console.log ('El item es: ' + item);
                let linieInTextFormat = "Fecha: " + currentDayFormated + "\n\n";
                linieInTextFormat += "Estimados Srs.:\n";
                linieInTextFormat += "Los productos de mi pedido nº: " + orderId + " son:\n\n";
                linieInTextFormat += "Cód.\tDescripción\t\t\t\tUnidades\t\tPrecio\t\tIVA\t\tTotal\n";
                linieInTextFormat += "====\t=========\t\t\t\t========\t====\t\t====\t\t=====\n";
                let linieInHTMLFormat = "<p>Fecha: " + currentDay + "</p><br>";
                linieInHTMLFormat += "<p>Estimados Srs.: </p><br>";
                linieInHTMLFormat += "<p>Los productos de mi pedido nº: <b>" + orderId + "</b> son:</p><br>";
                linieInHTMLFormat += "<p>Cód.&nbsp;&nbsp;&nbsp;&nbsp;Descripción&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidades&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Precio&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IVA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total</p>";
                linieInHTMLFormat += "====&nbsp;&nbsp;&nbsp;========&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=======&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=====&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;====";
                for (let index = 0; index < purchasedProducts.length; index++) {
                    if (purchasedProducts[index].email === item) {
                        // Product from the provider
                        const element = purchasedProducts[index];
                        const totalAmount = (purchasedProducts[index].purchased * purchasedProducts[index].total_amount)/10000;
                        //const discountAmount = (totalAmount*20) / 100;   // Discount 20%
                        //const discountAmount = (totalAmount*0) / 100;   // Discount 20%
                        const discountAmount = 0;
                        //const taxAmount = ((totalAmount - discountAmount) * element.tax_apply)/100;
                        const taxAmount = (purchasedProducts[index].purchased * element.tax_amount)/10000;
                        console.log('El valor de totalAmount es: ' + totalAmount.toFixed(2));
                        console.log('El valor de discountAmount es: ' + discountAmount.toFixed(2));
                        console.log('El valor de taxAmount es: ' + taxAmount.toFixed(2));
                        console.log('El valor de taxAmount es: ' + ("       " + totalAmount.toFixed(2)).slice(-7));
                        linieInTextFormat += "\n" + ("    " + purchasedProducts[index].product_id.toString()).slice(+4) + "\t" + ("               " + purchasedProducts[index].product_name_long).slice(15)
                                    + "\t\t\t\t" + ("   " + purchasedProducts[index].purchased.toString()).slice(-3) + "\t\t\t\t" + ("     " + (purchasedProducts[index].total_amount/10000).toFixed(2)).slice(-5)
                                    + "\t\t" + ("       " + taxAmount.toFixed(2)).slice(7) + "\t\t" + ("       " + totalAmount.toFixed(2)).slice(-7);
                        //linieInTextFormat += "\n" + ("    " + purchasedProducts[index].product_id.toString()).slice(+4) + "\t" + ("               " + purchasedProducts[index].product_name).slice(15)
                        //+ "\t\t\t\t" + ("   " + purchasedProducts[index].purchased.toString()).slice(-3) + "\t\t\t\t" + ("     " + (purchasedProducts[index].total_amount/10000).toFixed(2)).slice(-5)
                        //+ "\t\t" + ("       " + taxAmount.toFixed(2)).slice(-7) + ("       " + totalAmount.toFixed(2)).slice(-7) + "\t\t";
                        linieInHTMLFormat += "<p>" + ("    " + purchasedProducts[index].product_id.toString()).slice(+4) + "&nbsp;&nbsp;&nbsp;&nbsp;" + ("               " + purchasedProducts[index].product_name_long).slice(15)
                        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + ("   " + purchasedProducts[index].purchased.toString()).slice(-3) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + ("     " + (purchasedProducts[index].total_amount/10000).toFixed(2)).slice(-5)
                        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + ("       " + taxAmount.toFixed(2)).slice(-7) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + ("       " + totalAmount.toFixed(2)).slice(-7) + "</p>";
                    }
                }
                const message = {
                    from: {
                        name: 'Soporte Compras',
    //                            address: 'angel.ruiz@synapsys-consulting.com'
                        address: 'info@synapsys-consulting.com'
                    },
                    to: item,
                    subject: "Pedido Nº.: " + orderId,
                    text: linieInTextFormat,
                    html: linieInHTMLFormat
                }
                console.log('Mensaje construido.');
                const info = await transporter.sendMail (message);
                console.log('Message sent: %s', info.messageId);
            }
        }
        if (someWasError) {
            transact.rollback();
            res.status(405).send({message: 'Hubo un error al enviar el correo electrónico con los detalles del pedido. Error: '});            
        } else {
            transact.commit();
            res.status(200).send({data: "Su compra ha sido tramitada correctamente."});    
        }
    } catch (err) {
        console.log(err);
        transact.rollback();
        res.status(500).send({message: " Sentimos las molestias. No se ha podido realizar su compra. Póngase en contacto con el centro de atención al cliente. Error: " + err});
    }
}
export async function getPurchaseByUserId (req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id);
    interface purchaseByUserId {
        ORDER_ID: number,
        PROVIDER_NAME: string,
        BUYER_NAME: string,
        SHOW_NAME: string,
        ALL_STATUS: string,
        STATUS_ID: string,
        NUM_STATUS: number,
        ITEMS: number,
        SITUACION: string,
        TOTAL_AMOUNT: number,
        TAX_AMOUNT: number,
        DISCOUNT_AMOUNT: number,
        PRODUCT_PRICE_FINAL: number,
        PRODUCT_PRICE: number,
        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: number,
        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: number,
        ORDER_DATE: Date
    }
    interface statusToTransitionTo {
        DESTINATION_STATUS_ID: string,
        STATUS_NAME: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    interface resultType {
        ORDER_ID: number,
        PROVIDER_NAME: string,
        BUYER_NAME: string,
        SHOW_NAME: string,
        ALL_STATUS: string,
        STATUS_ID: string,
        NUM_STATUS: number,
        ITEMS: number,
        SITUACION: string,
        TOTAL_AMOUNT: number,
        TAX_AMOUNT: number,
        DISCOUNT_AMOUNT: number,
        PRODUCT_PRICE_FINAL: number,
        PRODUCT_PRICE: number,
        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: number,
        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: number,
        ORDER_DATE: Date,
        STATUS_TO_TRANSITION_TO: Array<statusToTransitionTo>
    }
    const result: Array<resultType> = [];
    try {

        const data = <Array<purchaseByUserId>>await sequelize.query (
            Querys.queryGetPurchaseByUserId(),
            {
                bind: [userId],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        if (data) {
            for (let index = 0; index < data.length; index++) {
                console.log ('El valor de userId es: ' + userId.toString());
                console.log ('El valor de data[index].ALL_STATUS es: ' + data[index].STATUS_ID);
                const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                    Querys.getStatusToTransitionTo(),
                    {
                        bind: [data[index].STATUS_ID, userId],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                if (statusToTransitionToReturned) {
                    const tmpResult: resultType = {
                        ORDER_ID: data[index].ORDER_ID,
                        PROVIDER_NAME: data[index].PROVIDER_NAME,
                        BUYER_NAME: data[index].BUYER_NAME,
                        SHOW_NAME: data[index].SHOW_NAME,
                        ALL_STATUS: data[index].ALL_STATUS,
                        STATUS_ID: data[index].STATUS_ID,
                        NUM_STATUS: data[index].NUM_STATUS,
                        ITEMS: data[index].ITEMS,
                        SITUACION: data[index].SITUACION,
                        TOTAL_AMOUNT: data[index].TOTAL_AMOUNT,
                        TAX_AMOUNT: data[index].TAX_AMOUNT,
                        DISCOUNT_AMOUNT: data[index].DISCOUNT_AMOUNT,
                        PRODUCT_PRICE_FINAL: data[index].PRODUCT_PRICE_FINAL,
                        PRODUCT_PRICE: data[index].PRODUCT_PRICE,
                        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX,
                        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_AFTER_DISCOUNT_WITHOUT_TAX,
                        ORDER_DATE: data[index].ORDER_DATE,
                        STATUS_TO_TRANSITION_TO: statusToTransitionToReturned
                    }
                    result.push(tmpResult);
                } else {
                    const tmpResult: resultType = {
                        ORDER_ID: data[index].ORDER_ID,
                        PROVIDER_NAME: data[index].PROVIDER_NAME,
                        BUYER_NAME: data[index].BUYER_NAME,
                        SHOW_NAME: data[index].SHOW_NAME,
                        ALL_STATUS: data[index].ALL_STATUS,
                        STATUS_ID: data[index].STATUS_ID,
                        NUM_STATUS: data[index].NUM_STATUS,
                        ITEMS: data[index].ITEMS,
                        SITUACION: data[index].SITUACION,
                        TOTAL_AMOUNT: data[index].TOTAL_AMOUNT,
                        TAX_AMOUNT: data[index].TAX_AMOUNT,
                        DISCOUNT_AMOUNT: data[index].DISCOUNT_AMOUNT,
                        PRODUCT_PRICE_FINAL: data[index].PRODUCT_PRICE_FINAL,
                        PRODUCT_PRICE: data[index].PRODUCT_PRICE,
                        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX,
                        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_AFTER_DISCOUNT_WITHOUT_TAX,
                        ORDER_DATE: data[index].ORDER_DATE,
                        STATUS_TO_TRANSITION_TO: []
                    }
                    result.push(tmpResult);
                }
            }
            res.status(200).send({ result });
        } else {
            res.status(404).send({ "message": "No existen pedidos almacenadas para el usuario"});
        }
    } catch (err) {
        res.status(500).send({ message: err + ' .Ha ocurrido un error al recuperar los pedidos.'});
    }
}
export async function getPurchaseLinesByOrderId (req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.userId);
    const orderId: number = parseInt(req.params.orderId);
    const providerName = req.params.providerName;
    console.log('El valor de providerName es: #' + providerName + '#');
    interface purchaseLineByOrderId {
        ORDER_ID: number,
        PROVIDER_NAME: string,
        PRODUCT_ID: number,
        PRODUCT_NAME: string,
        ALL_STATUS: string,
        STATUS_ID: string,
        NUM_STATUS: number,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        ITEMS: number,
        ID_UNIT: string,
        NEW_QUANTITY: number,
        NEW_PRODUCT_PRICE_FINAL: number,
        BAN_OFICIAL_PRICE: string,
        SITUACION: string,
        TOTAL_AMOUNT: number,
        TAX_AMOUNT: number,
        DISCOUNT_AMOUNT: number,
        PRODUCT_PRICE_FINAL: number,
        PRODUCT_PRICE: number,
        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: number,
        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: number,
        ORDER_DATE: Date,
        REMARK_SELLER: string,
        REMARK_BUYER: string
    }
    interface statusToTransitionTo {
        DESTINATION_STATUS_ID: string,
        STATUS_NAME: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    interface resultType {
        ORDER_ID: number,
        PROVIDER_NAME: string,
        PRODUCT_ID: number,
        PRODUCT_NAME: string,
        ALL_STATUS: string,
        STATUS_ID: string,
        NUM_STATUS: number,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        ITEMS: number,
        ID_UNIT: string,
        NEW_QUANTITY: number,
        NEW_PRODUCT_PRICE_FINAL: number,
        BAN_OFICIAL_PRICE: string,
        SITUACION: string,
        TOTAL_AMOUNT: number,
        TAX_AMOUNT: number,
        DISCOUNT_AMOUNT: number,
        PRODUCT_PRICE_FINAL: number,
        PRODUCT_PRICE: number,
        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: number,
        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: number,
        ORDER_DATE: Date,
        REMARK_SELLER: string,
        REMARK_BUYER: string,
        STATUS_TO_TRANSITION_TO: Array<statusToTransitionTo>
    }
    const result: Array<resultType> = [];
    try {
        const data = <Array<purchaseLineByOrderId>>await sequelize.query (
            Querys.queryGetPurchaseLinesByOrderId(),
            {
                bind: [orderId, providerName, userId],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        if (data) {
            for (let index = 0; index < data.length; index++) {
                console.log ('El valor de userId es: ' + userId.toString());
                console.log ('El valor de data[index].ALL_STATUS es: ' + data[index].STATUS_ID);
                const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                    Querys.getStatusToTransitionTo(),
                    {
                        bind: [data[index].STATUS_ID, userId],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                if (statusToTransitionToReturned) {
                    const tmpResult: resultType = {
                        ORDER_ID: data[index].ORDER_ID,
                        PROVIDER_NAME: data[index].PROVIDER_NAME,
                        PRODUCT_ID: data[index].PRODUCT_ID,
                        PRODUCT_NAME: data[index].PRODUCT_NAME,
                        ALL_STATUS: data[index].ALL_STATUS,
                        STATUS_ID: data[index].STATUS_ID,
                        NUM_STATUS: data[index].NUM_STATUS,
                        BAN_PRICE: data[index].BAN_PRICE,
                        BAN_QUANTITY: data[index].BAN_QUANTITY,
                        ITEMS: data[index].ITEMS,
                        ID_UNIT: data[index].ID_UNIT,
                        NEW_QUANTITY: data[index].NEW_QUANTITY,
                        NEW_PRODUCT_PRICE_FINAL: data[index].NEW_PRODUCT_PRICE_FINAL,
                        BAN_OFICIAL_PRICE: data[index].BAN_OFICIAL_PRICE,
                        SITUACION: data[index].SITUACION,
                        TOTAL_AMOUNT: data[index].TOTAL_AMOUNT,
                        TAX_AMOUNT: data[index].TAX_AMOUNT,
                        DISCOUNT_AMOUNT: data[index].DISCOUNT_AMOUNT,
                        PRODUCT_PRICE_FINAL: data[index].PRODUCT_PRICE_FINAL,
                        PRODUCT_PRICE: data[index].PRODUCT_PRICE,
                        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX,
                        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_AFTER_DISCOUNT_WITHOUT_TAX,
                        ORDER_DATE: data[index].ORDER_DATE,
                        REMARK_SELLER: data[index].REMARK_SELLER,
                        REMARK_BUYER: data[index].REMARK_BUYER,
                        STATUS_TO_TRANSITION_TO: statusToTransitionToReturned
                    }
                    result.push(tmpResult);
                } else {
                    const tmpResult: resultType = {
                        ORDER_ID: data[index].ORDER_ID,
                        PROVIDER_NAME: data[index].PROVIDER_NAME,
                        PRODUCT_ID: data[index].PRODUCT_ID,
                        PRODUCT_NAME: data[index].PRODUCT_NAME,
                        ALL_STATUS: data[index].ALL_STATUS,
                        STATUS_ID: data[index].STATUS_ID,
                        NUM_STATUS: data[index].NUM_STATUS,
                        BAN_PRICE: data[index].BAN_PRICE,
                        BAN_QUANTITY: data[index].BAN_QUANTITY,
                        ITEMS: data[index].ITEMS,
                        ID_UNIT: data[index].ID_UNIT,
                        NEW_QUANTITY: data[index].NEW_QUANTITY,
                        NEW_PRODUCT_PRICE_FINAL: data[index].NEW_PRODUCT_PRICE_FINAL,
                        BAN_OFICIAL_PRICE: data[index].BAN_OFICIAL_PRICE,
                        SITUACION: data[index].SITUACION,
                        TOTAL_AMOUNT: data[index].TOTAL_AMOUNT,
                        TAX_AMOUNT: data[index].TAX_AMOUNT,
                        DISCOUNT_AMOUNT: data[index].DISCOUNT_AMOUNT,
                        PRODUCT_PRICE_FINAL: data[index].PRODUCT_PRICE_FINAL,
                        PRODUCT_PRICE: data[index].PRODUCT_PRICE,
                        TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_BEFORE_DISCOUNT_WITHOUT_TAX,
                        TOTAL_AFTER_DISCOUNT_WITHOUT_TAX: data[index].TOTAL_AFTER_DISCOUNT_WITHOUT_TAX,
                        ORDER_DATE: data[index].ORDER_DATE,
                        REMARK_SELLER: data[index].REMARK_SELLER,
                        REMARK_BUYER: data[index].REMARK_BUYER,
                        STATUS_TO_TRANSITION_TO: []
                    }
                    result.push(tmpResult);
                }
            }
            res.status(200).send({ result });
        } else {
            res.status(404).send({ "message": "No existen líneas almacenadas para el pedido."});
        }
    } catch (err) {
        res.status(500).send({ message: err + ' .Ha ocurrido un error al recuperar el detalle del pedido.'});
    }
}
export async function purchaseLineStateTransition (req: Request, res: Response): Promise<void> {
    const orderId: number = parseInt(req.params.orderId);
    const providerName: string = req.params.providerName;
    const userId: number = req.body.user_id;
    const nextState: string = req.body.next_state;
    const productId: number = parseInt(req.body.product_id);
    const newFecha: Date = new Date();
    interface statusToTransitionTo {
        DESTINATION_STATUS_ID: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    //const transact = await sequelize.transaction();
    try {
        await sequelize.query (
            Querys.queryUpdatePurchaseLineState(),
            {
                bind: [nextState, userId, newFecha, orderId, providerName, productId],
                raw: true,
                type: QueryTypes.UPDATE,
                //transaction: transact
            }
        );
        const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
            Querys.getStatusToTransitionTo(),
            {
                bind: [nextState, userId],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        // Now we must get the current status_id of the provider line of the purchase
        // because it could have been changed since the status_id of one of the item lines has changed
        console.log (Querys.queryGetStatusPurchase());
        interface statusItemFather {
            ORDER_ID: number,
            PROVIDER_NAME: string,
            ALL_STATUS: string,
            STATUS_ID: string,
            NUM_STATUS: number
        }
        const newStatusIdOfTheItemFather = <Array<statusItemFather>>await sequelize.query (
            Querys.queryGetStatusPurchase(),
            {
                bind: [orderId, providerName],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        // Get the next status_id of the provider line of the purchase
        const statusToTransitionToItemFatherReturned = <Array<statusToTransitionTo>>await sequelize.query (
            Querys.getStatusToTransitionTo(),
            {
                bind: [newStatusIdOfTheItemFather[0].STATUS_ID, userId],    // Always newStatusIdOfTheItemFather has a simple row, the first row
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        //const transactionId = await sequelize.query (
        //    Querys.queryTransactionsSequence(),
        //    {
        //        type: QueryTypes.SELECT,
        //        transaction: transact
        //    }
        //);
        //if (transactionId) {
        //    await sequelize.query (Querys.querySaveTransaction(),
        //        {
        //            bind: [orderId
        //                , newFecha.getDate()
        //                , newFecha.getHours().toString() + ':' + newFecha.getMinutes().toString()
        //            ],
        //            type: QueryTypes.INSERT,
        //            transaction: transact
        //        }
        //    );
        //}
        res.status(200).send (
            { 
                "nextStatesToTransitionTo": statusToTransitionToReturned,
                "nextStatesToTransitionToItemFather": statusToTransitionToItemFatherReturned,
                "statusIdOfTheItemFather": newStatusIdOfTheItemFather[0].STATUS_ID,
                "statusNameOfTheItemFather": newStatusIdOfTheItemFather[0].ALL_STATUS,
                "numStatusOfTheItemFather": newStatusIdOfTheItemFather[0].NUM_STATUS
            }
        );
    } catch (err) {
        //transact.rollback();
        res.status(500).send({ message: err + ' .Ha ocurrido un error al grabar el nuevo estado del pedido.' });
    }
}
///////////////////////////////////////////////////////////////////////////////////////
// Author:Ángel Ruiz Cantón
// update the field STATUS_ID
// Fecha: 
///////////////////////////////////////////////////////////////////////////////////////
export async function purchaseStateTransition (req: Request, res: Response): Promise<void> {
    const orderId: number = parseInt(req.params.orderId);
    const providerName: string = req.params.providerName;
    const userId: number = req.body.user_id;
    const nextState: string = req.body.next_state;
    const newFecha: Date = new Date();
    interface statusToTransitionTo {
        DESTINATION_STATUS_ID: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    //const transact = await sequelize.transaction();
    try {
        await sequelize.query (
            Querys.queryUpdatePurchaseState(),
            {
                bind: [nextState, userId, newFecha, orderId, providerName],
                raw: true,
                type: QueryTypes.UPDATE,
                //transaction: transact
            }
        );
        const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
            Querys.getStatusToTransitionTo(),
            {
                bind: [nextState, userId],
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        //const transactionId = await sequelize.query (
        //    Querys.queryTransactionsSequence(),
        //    {
        //        type: QueryTypes.SELECT,
        //        transaction: transact
        //    }
        //);
        //if (transactionId) {
        //    await sequelize.query (Querys.querySaveTransaction(),
        //        {
        //            bind: [orderId
        //                , newFecha.getDate()
        //                , newFecha.getHours().toString() + ':' + newFecha.getMinutes().toString()
        //            ],
        //            type: QueryTypes.INSERT,
        //            transaction: transact
        //        }
        //    );
        //}
        res.status(200).send({ "nextStatesToTransitionTo": statusToTransitionToReturned });
    } catch (err) {
        //transact.rollback();
        res.status(500).send({ message: err + ' .Ha ocurrido un error al grabar el nuevo estado del pedido.' });
    }
}
///////////////////////////////////////////////////////////////////////////////////////
// Author:Ángel Ruiz Cantón
// update the fields QANTITY, PRODUCT_PRICE, TOTAL_BEFORE_DISCOUNT, TOTAL_AMOUNT, OPEN_AMOUNT, DISCOUNT_AMOUNT, TAX_AMOUNT
// Fecha: 23/08/2021
///////////////////////////////////////////////////////////////////////////////////////
export async function modifyPurchaseLine (req: Request, res: Response): Promise<void> {
    const orderId: number = parseInt(req.params.orderId);
    const providerName: string = req.params.providerName;
    const productId: number = req.body.product_id;
    const userId: number = req.body.user_id;
    const userRole: string = req.body.user_role;
    const newPurchased: number = req.body.new_purchased;
    const newProductPrice: number = req.body.new_product_price;
    const totalBeforeDiscount: number = req.body.total_before_discount;
    const totalAmount: number = req.body.total_amount;
    const discountAmount: number = req.body.discount_amount;
    const taxAmount: number= req.body.tax_amount;
    const isOfficial: string = req.body.is_official;
    const caseToApply: number = req.body.case_to_apply;
    const comment: string = req.body.comment;
    const newFecha: Date = new Date();
    console.log ('El orderId es: ' + orderId.toString());
    console.log ('El providerName es: ' + providerName);
    console.log ('El userId es: ' + userId);
    console.log ('El userRole es: ' + userRole);
    console.log ('El newPurchased es: ' + (newPurchased == null) ? 'La nueva cantidad viene nula' : newPurchased.toString());
    console.log ('El newProductPrice es: ' + (newProductPrice == null) ? 'El nuevo precio viene nulo': newProductPrice.toString());
    console.log ('El productId es: ' + productId.toString());
    console.log ('La quantity es: ' + (newPurchased == null) ? 'Viene null': newPurchased.toString());
    console.log ('El totalBeforeDiscount es: ' + totalBeforeDiscount.toString());
    console.log ('El totalAmount es: ' + totalAmount.toString());
    console.log ('El discountAmount es: ' + discountAmount.toString());
    console.log ('El taxAmount es: ' + taxAmount.toString());
    console.log ('El isOfficial es: ' + isOfficial == null ? "N" : (isOfficial == "true") ? "Y" : "null");
    console.log ('El caseToApply es: ' + caseToApply.toString());
    interface statusToTransitionTo {
        DESTINATION_STATUS_ID: string,
        STATUS_NAME: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    interface banPriceUndBanQuantityValue {
        // current BAN_PRICE and BAN_QUANTITY among the current state of the purchase line
        DESTINATION_STATUS_ID: string,
        STATUS_NAME: string,
        BAN_PRICE: string,
        BAN_QUANTITY: string,
        PRIORITY: number,
        ROLE_NAME: string
    }
    try {
        if (caseToApply == 1) {
            // Case 1
            // The price and the quantity of the purchased has been changed by the user
            const result = await sequelize.query (
                Querys.queryUpdatePurchaseLine(caseToApply, userRole),
                {
                    bind: [newPurchased, newProductPrice, isOfficial == "true" ? "Y":null, totalBeforeDiscount,
                        totalAmount, discountAmount, taxAmount,
                            userId, newFecha, comment, orderId, providerName, productId],
                    type: QueryTypes.UPDATE,
                    //transaction: transact
                }
            );
            console.log ('El valor de retorno del update es: ' + result[1].toString());
            const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                Querys.getStatusToTransitionTo(),
                {
                    bind: ["O", userId],
                    raw: true,
                    type: QueryTypes.SELECT
                }
            );
            if (statusToTransitionToReturned) {
                // get the current values of the BAN_PRICE and BAN_QUANTITY among the state of
                // the modified purchase line. The state of the modified purchasedline is "O" (OBSERVACIONES)
                const currentBanQuantityUndBanPriceValue = <Array<banPriceUndBanQuantityValue>>await sequelize.query (
                    Querys.getBanPriceUndBanQuantityValues(),
                    {
                        bind: [userId, "O"],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                res.status(200).send (
                    {
                        statusToTransitionTo: statusToTransitionToReturned,
                        currentBanQuantityBanPrice: currentBanQuantityUndBanPriceValue
                    }
                );
            }
            //res.status(200).send ({message: "Todo ha ido OK. El numero de registros actualizados es: " + result[1]});
        } else if (caseToApply == 2) {
            // Case 2
            // Only the price of the purchased has been changed by the user
            const result = await sequelize.query (
                Querys.queryUpdatePurchaseLine (caseToApply, userRole),
                {
                    bind: [newProductPrice, isOfficial == "true" ? "Y":null, totalBeforeDiscount,
                        totalAmount, discountAmount, taxAmount,
                            userId, newFecha, comment, orderId, providerName, productId],
                    type: QueryTypes.UPDATE,
                    //transaction: transact
                }
            );
            console.log ('El valor de retorno del update es: ' + result[1].toString());
            const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                Querys.getStatusToTransitionTo(),
                {
                    bind: ["O", userId],
                    raw: true,
                    type: QueryTypes.SELECT
                }
            );
            if (statusToTransitionToReturned) {
                // get the current values of the BAN_PRICE and BAN_QUANTITY among the state of
                // the modified purchase line. The state of the modified purchasedline is "O" (OBSERVACIONES)
                const currentBanQuantityUndBanPriceValue = <Array<banPriceUndBanQuantityValue>>await sequelize.query (
                    Querys.getBanPriceUndBanQuantityValues(),
                    {
                        bind: [userId, "O"],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                res.status(200).send (
                    {
                        statusToTransitionTo: statusToTransitionToReturned,
                        currentBanQuantityBanPrice: currentBanQuantityUndBanPriceValue
                    }
                );    
            }
            //res.status(200).send ({message: "Todo ha ido OK. El numero de registros actualizados es: " + result[1]});

        } else if (caseToApply == 3) {
            // Case 3
            // Only the quantity has been changed by the user
            const result = await sequelize.query (
                Querys.queryUpdatePurchaseLine (caseToApply, userRole),
                {
                    bind: [newPurchased, totalBeforeDiscount,
                        totalAmount, discountAmount, taxAmount,
                            userId, newFecha, comment, orderId, providerName, productId],
                    type: QueryTypes.UPDATE,
                    //transaction: transact
                }
            );
            console.log ('El valor de retorno del update es: ' + result[1].toString());
            const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                Querys.getStatusToTransitionTo(),
                {
                    bind: ["O", userId],
                    raw: true,
                    type: QueryTypes.SELECT
                }
            );
            if (statusToTransitionToReturned) {
                // get the current values of the BAN_PRICE and BAN_QUANTITY among the state of
                // the modified purchase line. The state of the modified purchasedline is "O" (OBSERVACIONES)
                const currentBanQuantityUndBanPriceValue = <Array<banPriceUndBanQuantityValue>>await sequelize.query (
                    Querys.getBanPriceUndBanQuantityValues(),
                    {
                        bind: [userId, "O"],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                res.status(200).send (
                    {
                        statusToTransitionTo: statusToTransitionToReturned,
                        currentBanQuantityBanPrice: currentBanQuantityUndBanPriceValue
                    }
                );
            }
            //res.status(200).send ({message: "Todo ha ido OK. El numero de registros actualizados es: " + result[1]});
        } else {
            // Anyway is taken as the case 1
            const result = await sequelize.query (
                Querys.queryUpdatePurchaseLine(caseToApply, userRole),
                {
                    bind: [newPurchased, newProductPrice, isOfficial == "true" ? "Y":null, totalBeforeDiscount,
                        totalAmount, discountAmount, taxAmount,
                            userId, newFecha, comment, orderId, providerName, productId],
                    type: QueryTypes.UPDATE,
                    //transaction: transact
                }
            );
            console.log ('El valor de retorno del update es: ' + result[1].toString());
            const statusToTransitionToReturned = <Array<statusToTransitionTo>>await sequelize.query (
                Querys.getStatusToTransitionTo(),
                {
                    bind: ["O", userId],
                    raw: true,
                    type: QueryTypes.SELECT
                }
            );
            if (statusToTransitionToReturned) {
                // get the current values of the BAN_PRICE and BAN_QUANTITY among the state of
                // the modified purchase line. The state of the modified purchasedline is "O" (OBSERVACIONES)
                const currentBanQuantityUndBanPriceValue = <Array<banPriceUndBanQuantityValue>>await sequelize.query (
                    Querys.getBanPriceUndBanQuantityValues(),
                    {
                        bind: [userId, "O"],
                        raw: true,
                        type: QueryTypes.SELECT
                    }
                );
                res.status(200).send (
                    {
                        statusToTransitionTo: statusToTransitionToReturned,
                        currentBanQuantityBanPrice: currentBanQuantityUndBanPriceValue
                    }
                );
            }
            //res.status(200).send ({message: "Todo ha ido OK. El numero de registros actualizados es: " + result[1]});
        }
    } catch (err) {
        //transact.rollback();
        console.log ('El error es: ' + err);
        res.status(500).send({ message: err + ' .Ha ocurrido un error al grabar la modificación de la línea del pedido.' });
    }
}