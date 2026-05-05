"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const db_model_1 = require("../src/models/db.model");
const user_router_1 = require("./routes/user.router");
const product_router_1 = require("./routes/product.router");
const productAvail_router_1 = require("./routes/productAvail.router");
const address_route_1 = require("./routes/address.route");
const angel_router_1 = require("./routes/angel.router");
const app = express_1.default();
const port = 9000;
const one = 1;
const two = 2;
//Habilitamos CORS para cualquier origen
app.use(cors_1.default());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: false }));
// parse requests of content-type: application/json
app.use(express_1.default.json()); // convierte a objetos json lo que nos llega por http
// Rutas base
app.use("/server", user_router_1.usersRouter);
app.use("/server", product_router_1.productsRouter);
app.use("/server", productAvail_router_1.productsAvailRouter);
app.use("/server", address_route_1.addressRouter);
app.use("/server", angel_router_1.angelsRouter);
app.get('/', (_req, res) => res.send(`1 + 2 = ${one + two}`));
//Ponemos a escuchar al servidor
https_1.default.createServer({
    key: fs_1.default.readFileSync('platCompras.key'),
    cert: fs_1.default.readFileSync('platCompras.crt')
}, app).listen(port);
//app.listen(port);
console.log(`El servidor API DE LA PLATAFORMA DE COMPRAS está corriendo en: [app : https//localhost:${port}]`);
db_model_1.sequelize.sync();
//# sourceMappingURL=index.js.map