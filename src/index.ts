import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize } from "../src/models/db.model";

import { usersRouter } from "./routes/user.router";
import { productsRouter } from "./routes/product.router";
import { angelsRouter } from "./routes/angel.router";

const app = express();
const port = 9000;

const one = 1;
const two = 2;

//Habilitamos CORS para cualquier origen
app.use(cors());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse requests of content-type: application/json
app.use(bodyParser.json());		// convierte a objetos json lo que nos llega por http

// Rutas base
app.use("/server", usersRouter);
app.use("/server", productsRouter);
app.use("/server", angelsRouter);

app.get('/', (_req, res) => res.send(`1 + 2 = ${one + two}`));

//Ponemos a escuchar al servidor
app.listen(port);

console.log(`[app : http//localhost:${port}]`);

sequelize.sync();
