"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datosConexion = void 0;
exports.datosConexion = {
    //HOST: "desa-pl-compras.clx1x5nnlucd.us-east-1.rds.amazonaws.com",
    HOST: "krri.clx1x5nnlucd.us-east-1.rds.amazonaws.com",
    USER: "APP_KRRIDM",
    PASSWORD: "APP_KRRIDM1",
    DB: "KRRI",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
