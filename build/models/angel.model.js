"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angel = void 0;
const sequelize_1 = require("sequelize");
const db_model_1 = require("./db.model");
class Angel extends sequelize_1.Model {
}
exports.Angel = Angel;
Angel.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(50)
    }
}, {
    tableName: "ANGEL",
    sequelize: db_model_1.sequelize,
    //timestamps: false
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date',
});
