import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class PersoneIdentity extends Model {
    public persone_id!: number;
    public persone_name!: string | null;
    public persone_type!: string | null;
    public acct_no!: string | null;
    public fiscal_id!: string | null;
    public fiscal_id_type!: string | null;
    public eff_date!: Date | null;
    public exp_date!: Date | null;
    public type_day_delivery!: string | null;
    public min_days_delivery!: number | null;
    public max_days_delivery!: number | null;
    public remark!: string | null;
    public days_delivery!: string | null;
    public status_date!: Date | null;
    public status_id!: string | null;
    public user_create_id!: number | null;
    public user_modify_id!: number | null;
    public scenario!: string;
    public currency_id!: string;
    public language_code!: string | null;
    public fiscal_email!: string | null;
    public email!: string | null;
    public business_name!: string | null;
    public organization!: string | null;
    public user_id!: number | null;
    public partner_id!: number | null;
    public partner_name!: string | null;
    
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
PersoneIdentity.init({
    persone_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    persone_name: {
        type: DataTypes.STRING(100)
    },
    persone_type: {
        type: DataTypes.STRING(1)
    },
    acct_no: {
        type: DataTypes.STRING(100)
    },
    fiscal_id: {
        type: DataTypes.STRING(100)
    },
    fiscal_id_type: {
        type: DataTypes.STRING(100)
    },
    eff_date: {
        type: DataTypes.DATE
    },
    exp_date: {
        type: DataTypes.DATE
    },
    type_day_delivery: {
        type: DataTypes.STRING(3)
    },
    min_days_delivery: {
        type: DataTypes.DECIMAL(3,0)
    },
    max_days_delivery: {
        type: DataTypes.DECIMAL(3,0)
    },
    remark: {
        type: DataTypes.STRING(250)
    },
    days_delivery: {
        type: DataTypes.STRING(100)
    },
    status_date: {
        type: DataTypes.DATE
    },
    status_id: {
        type: DataTypes.STRING(3)
    },
    user_create_id: {
        type: DataTypes.BIGINT
    },
    user_modify_id: {
        type: DataTypes.BIGINT
    },
    scenario: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    currency_id: {
        type: DataTypes.STRING(5)
    },
    language_code: {
        type: DataTypes.STRING(10)
    },
    fiscal_email: {
        type: DataTypes.STRING(250)
    },
    email: {
        type: DataTypes.STRING(250)
    },
    business_name: {
        type: DataTypes.STRING(250)
    },
    organization: {
        type: DataTypes.STRING(50)
    },
    user_id: {
        type: DataTypes.DECIMAL(10,0)
    },
    partner_id: {
        type: DataTypes.SMALLINT
    },
    partner_name: {
        type: DataTypes.STRING(100)
    }
},
{
    tableName: "KRC_PERSONE_IDENTITY",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);