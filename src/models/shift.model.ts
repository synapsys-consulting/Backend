import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class Shift extends Model {
    public shift_id!: number;
    public shift_name!: string;
    public shift_desc!: number;
    public shift_hour_start!: string;
    public shift_hour_end!: string;
    public day_type!: string | null;
    public status_id!: string | null;
    public status_date!: Date;
    public eff_date!: Date | null;
    public exp_date!: Date | null;
    public user_create_id!: number | null;
    public user_modify_id!: number | null;
    public partner_id!: string;
    public partner_name!: string;
    public scenario!: string;
    
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Shift.init({
    shift_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    shift_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    shift_desc: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    shift_hour_start: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    shift_hour_end: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    day_type: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    eff_date: {
        type: DataTypes.DATE,
        allowNull:false
    },
    exp_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status_id: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    user_create_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_modify_id: {
        type: DataTypes.BIGINT
    },
    partner_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    partner_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    scenario: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
},
{
    tableName: "KRC_SHIFT",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);