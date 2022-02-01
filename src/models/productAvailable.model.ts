import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db.model";

export class ProductAvailable extends Model {
    public product_avail_id!: number;
    public order_id!: number;
    public product_id!: number;
    public quantity!: number;
    public product_price!: number;
    public product_price_paid!: number;
    public predictable_finish_date!: string | null;
    public reset_manual_date!: string | null;
    public calibrate_date!: string | null;
    public exp_date!: string;
    public status_date!: string;
    public user_create_id!: number | null;
    public user_modify_id!: number | null;
    public method!: string;
    public product_category_id!: number;
    public partner_id!: string;
    public partner_name!: string;
    
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
ProductAvailable.init(
{
    product_avail_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(14, 4),
        allowNull: false
    },
    product_price: {
        type: DataTypes.DECIMAL(20,0),
        allowNull: false
    },
    product_price_paid: {
        type: DataTypes.DECIMAL(20, 0),
        allowNull: true
    },
    predictable_finish_date: {
        type: DataTypes.STRING(1),
        allowNull: true
    },
    reset_manual_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    calibrate_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    exp_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_create_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    user_modify_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    method: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    product_category_id: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false
    },
    partner_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    partner_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},
{
    tableName: "KRC_PRODUCT_AVAIL",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);

