"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_model_1 = require("../src/models/db.model");
const user_router_1 = require("./routes/user.router");
const angel_router_1 = require("./routes/angel.router");
const app = express_1.default();
const port = 9000;
const one = 1;
const two = 2;
//Habilitamos CORS para cualquier origen
app.use(cors_1.default());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse requests of content-type: application/json
app.use(body_parser_1.default.json()); // convierte a objetos json lo que nos llega por http
// Rutas base
app.use("/server", user_router_1.usersRouter);
app.use("/server", angel_router_1.angelsRouter);
app.get('/', (_req, res) => res.send(`1 + 2 = ${one + two}`));
//Ponemos a escuchar al servidor
app.listen(port);
console.log(`[app : http//localhost:${port}]`);
db_model_1.sequelize.sync();
