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
const db_config_1 = require("../config/db.config");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB || "", process.env.USER || "", process.env.PASSWORD, {
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
        //acquire: datosConexion.pool.acquire,
        acquire: db_config_1.datosConexion.pool.acquire,
        //idle: datosConexion.pool.idle
        idle: db_config_1.datosConexion.pool.idle
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
