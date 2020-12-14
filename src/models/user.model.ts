import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class User extends Model {
    public user_id!: number;
    public user_name!: string;
    public user_lastname!: string | null;
    public user_firstname!: string | null;
    public phone_number!: string;
    public email!: string;
    public birth_date!: Date | null;
    public zip_code!: string | null;
    public user_nickname!: string | null;
    public status_id!: string;
    public eff_date!: Date | null;
    public exp_date!: Date | null;
    public user_create_id!: string;
    public user_modify_id!: string | null;
    public password!: string;
    public role!: string | null;
    public rid!: string | null;
    public imagen!: string | null;
    public scenario!: string | null;

    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
User.init (
{
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_lastname: {
        type: DataTypes.STRING(100)
    },
    user_firstname: {
        type: DataTypes.STRING(100)
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE
    },
    zip_code: {
        type: DataTypes.STRING(10)
    },
    user_nickname: {
        type: DataTypes.STRING(30)
    },
    status_id: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    eff_date: {
        type: DataTypes.DATE
    },
    exp_date: {
        type: DataTypes.DATE
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_create_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_modify_id: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING(500),
        allowNull: false    	
    },
    role: {
        type: DataTypes.STRING(150)
    },
    rid: {
        type: DataTypes.STRING(20)
    },
    imagen: {
        type: DataTypes.STRING(250)
    },
    scenario: {
        type: DataTypes.STRING(10)
    }
},
{
    tableName: "KRC_USER",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date',
    //deletedAt: 'status_date'
}
);
