import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import * as dotenv from "dotenv";

import { sequelize } from "../src/models/db.model";
import { loadQueriesFromDB } from "../src/models/queriesLoader";

import { usersRouter } from "./routes/user.router";
import { productsRouter } from "./routes/product.router";
import { productsAvailRouter } from "./routes/productAvail.router";
import { purchaseRouter } from "./routes/purchase.router";
import { addressRouter } from "./routes/address.route";
import { angelsRouter } from "./routes/angel.router";
import { shiftRouter } from "./routes/shift.router";

const app = express();
dotenv.config();
const port = process.env.PORT;
const ip = process.env.API;

const one = 1;
const two = 2;

//Habilitamos CORS para cualquier origen
app.use(cors());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));
// parse requests of content-type: application/json
app.use(express.json());		// convierte a objetos json lo que nos llega por http

// Rutas base
app.use("/server", usersRouter);
app.use("/server", productsRouter);
app.use("/server", productsAvailRouter);
app.use("/server", addressRouter);
app.use("/server", purchaseRouter);
app.use("/server", angelsRouter);
app.use("/server", shiftRouter);

app.get('/', (_req, res) => res.send(`1 + 2 = ${one + two}`));

//Ponemos a escuchar al servidor
/*
https.createServer({
    key: fs.readFileSync('platCompras.key'),
    cert: fs.readFileSync('platCompras.crt')
}, app).listen(port);
*/
app.listen(port);

console.log(`El servidor API DE LA PLATAFORMA DE COMPRAS está corriendo en: [app : https//${ip}:${port}]`);

sequelize.sync();

// Carga las queries de KRC_QUERY al cache en memoria. Si falla, el getQuery()
// del loader cae a queries.model.ts (fallback) y el backend sigue funcionando.
loadQueriesFromDB(sequelize);
