"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
//import { datosConexion } from "../config/db.config";
const dotenv = __importStar(require("dotenv"));
dotenv.config();
console.log("El valor de DB es: " + process.env.DB);
console.log("El valor de USER es: " + process.env.USUARIO);
console.log("El valor de PASSWORD es:  " + process.env.PASSWORD);
console.log("El valor de timezone es: " + process.env.timezone);
console.log("El valor de HOST es: " + process.env.HOST);
console.log("El valor de pool_max es: " + parseInt(process.env.pool_max || "").toString());
console.log("El valor de pool_max es: " + parseInt(process.env.pool_min || "").toString());
exports.sequelize = new sequelize_1.Sequelize(process.env.DB || "", process.env.USUARIO || "", process.env.PASSWORD, {
    //export const sequelize = new Sequelize(datosConexion.DB, datosConexion.USER, datosConexion.PASSWORD, {
    //host: datosConexion.HOST,
    host: process.env.HOST,
    dialect: "mariadb",
    dialectOptions: {
        //timezone: "Etc/GMT+1",
        timezone: process.env.timezone,
    },
    pool: {
        //max: datosConexion.pool.max,
        max: parseInt(process.env.pool_max || ""),
        //min: datosConexion.pool.min,
        min: parseInt(process.env.pool_min || ""),
        acquire: parseInt(process.env.acquire || ""),
        //acquire: datosConexion.pool.acquire,
        //idle: datosConexion.pool.idle
        idle: parseInt(process.env.idle || "")
    },
    define: {
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    }
});
// Compruebo la conexion
exports.sequelize
    .authenticate()
    .then(() => {
    console.log('La conexión a la BDD se ha establecido DE MANERA EXITOSA.');
})
    .catch(err => {
    console.error('Imposible conectar con la BDD:', err);
});
//# sourceMappingURL=db.model.js.map