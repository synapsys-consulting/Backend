"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_model_1 = require("./db.model");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    user_id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    user_lastname: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    user_firstname: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: false
    },
    birth_date: {
        type: sequelize_1.DataTypes.DATE
    },
    zip_code: {
        type: sequelize_1.DataTypes.STRING(10)
    },
    user_nickname: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    status_id: {
        type: sequelize_1.DataTypes.STRING(1),
        allowNull: false
    },
    eff_date: {
        type: sequelize_1.DataTypes.DATE
    },
    exp_date: {
        type: sequelize_1.DataTypes.DATE
    },
    status_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    user_create_id: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    user_modify_id: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    password: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.STRING(150)
    },
    rid: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING(250)
    },
    scenario: {
        type: sequelize_1.DataTypes.STRING(10)
    }
}, {
    tableName: "KRC_USER",
    sequelize: db_model_1.sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date',
});
