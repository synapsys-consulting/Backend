import { Sequelize } from "sequelize";
//import { datosConexion } from "../config/db.config";
import * as dotenv from "dotenv";
dotenv.config();
console.log ("El valor de DB es: " + process.env.DB);
console.log ("El valor de USER es: " + process.env.USUARIO);
console.log ("El valor de PASSWORD es:  " + process.env.PASSWORD);
console.log("El valor de timezone es: " + process.env.timezone);
console.log("El valor de HOST es: " + process.env.HOST);
console.log("El valor de pool_max es: " + parseInt(process.env.pool_max || "").toString());
console.log("El valor de pool_max es: " + parseInt(process.env.pool_min || "").toString());
export const sequelize = new Sequelize(process.env.DB || "", process.env.USUARIO || "", process.env.PASSWORD, {
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
sequelize
  .authenticate()
  .then(() => {
    console.log('La conexión a la BDD se ha establecido DE MANERA EXITOSA.');
  })
  .catch(err => {
    console.error('Imposible conectar con la BDD:', err);
  });
