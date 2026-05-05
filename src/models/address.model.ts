import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class Address extends Model {
    public addr_id!: number;
    public addr_type!: string;
    public addr_object!: number;
    public object_type!: string;
    public addr_street!: string;
    public addr_number!: string | null;
    public addr_complement!: string | null;
    public suburb!: string | null;
    public suburb_id!: number | null;
    public district!: string | null;
    public district_id!: number | null;
    public city!: string | null;
    public city_id!: number | null;
    public province!: string | null;
    public province_id!: number | null;
    public state!: string | null;
    public state_id!: number | null;
    public country!: string | null;
    public country_id!: number | null;
    public addr_gps!: string | null;
    public addr_zip_code!: string;
    public status_id!: string | null;
    public status_date!: Date;
    public user_create_id!: number | null;
    public user_modify_id!: number | null;
    public scenario!: string;
    public alias!: string | null;
    public indication!: string | null;
    
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Address.init({
    addr_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    addr_type: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    addr_object: {
        type: DataTypes.DECIMAL(10,0),
        allowNull: false
    },
    object_type: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    addr_street: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    addr_number: {
        type: DataTypes.STRING(100)
    },
    addr_complement: {
        type: DataTypes.STRING(100)
    },
    suburb: {
        type: DataTypes.STRING(100)
    },
    suburb_id: {
        type: DataTypes.DECIMAL(10, 0)
    },
    district: {
        type: DataTypes.STRING(100)
    },
    district_id: {
        type: DataTypes.DECIMAL(10, 0)
    },
    city: {
        type: DataTypes.STRING(100)
    },
    city_id: {
        type: DataTypes.DECIMAL(10, 0)
    },
    province: {
        type: DataTypes.STRING(100)
    },
    province_id: {
        type: DataTypes.DECIMAL (10, 0)
    },
    state: {
        type: DataTypes.STRING(100)
    },
    state_id: {
        type: DataTypes.DECIMAL(10,0)
    },
    country: {
        type: DataTypes.STRING(100)
    },
    country_id: {
        type: DataTypes.DECIMAL(10,0)
    },
    addr_gps: {
        type: DataTypes.STRING(100)
    },
    addr_zip_code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status_id: {
        type: DataTypes.STRING(3)
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_create_id: {
        type: DataTypes.BIGINT,
    },
    user_modify_id: {
        type: DataTypes.BIGINT
    },
    scenario: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    alias: {
        type: DataTypes.STRING(150),
    },
    indication: {
        type: DataTypes.STRING(150),
    }
},
{
    tableName: "KRC_ADDRESS",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);