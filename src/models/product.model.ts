import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db.model";
import { ProductCategory } from "./productCategory.model";

export class Product extends Model {
    public product_id!: number;
    public product_code!: string;
    public product_category_id!: number;
    public product_name!: string;
    public product_name_internal!: string;
    public product_description!: string | null;
    public brand!: string | null;
    public brand_id!: number | null;
    public min_quantity_sell!: number;
    public language_code!: string;
    public product_price!: number;
    public tax_id!: number;
    public currency_id!: string;
    public unit_id!: string;
    public weeks_warning!:number;
    public quantity_min_price!: number;
    public quantity_max_price!: number;
    public type_day_delivery!: string | null;
    public min_days_delivery!: string | null;
    public max_days_delivery!: string | null;
    public remark!: string | null;
    public days_delivery!: string | null;
    public product_type_id!: string | null;
    public provider_id!: string;
    public partner_id!: string;
    public partner_name!: string;
    public status_id!: string;
    public eff_date!: Date;
    public exp_date!: Date | null;
    public status_date!: Date;
    public user_create_id!: string;
    public user_modify_id!: string;
    public scenario!: string;
    public days_exp!: number | null;
    public expoiled_flag!: string | null;
    public countable_flag!: string;
    public source_id!: string;

    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Product.init (
{
    product_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    product_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    product_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    product_name_internal: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    product_description: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    brand_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    min_quantity_sell: {
        type: DataTypes.DECIMAL(15,4),
        allowNull: false
    },
    language_code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    product_price: {
        type: DataTypes.DECIMAL(20,0),
        allowNull: false
    },
    tax_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    currency_id: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    unit_id: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    weeks_warning: {
        type: DataTypes.DECIMAL(3,0),
        allowNull: false
    },
    quantity_min_price: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false
    },
    quantity_max_price: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false
    },
    type_day_delivery: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    min_days_delivery: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true
    },
    max_days_delivery: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true
    },
    remark: {
        type: DataTypes.STRING(140),
        allowNull: true
    },
    days_delivery: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    product_type_id: {
        type: DataTypes.DECIMAL(10,0),
        allowNull: true
    },
    provider_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    partner_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    partner_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status_id: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    eff_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    exp_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: true        
    },
    user_create_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_modify_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    scenario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    days_exp: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true
    },
    expoiled_flag: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    countable_flag: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    source_id: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
},
{
    tableName: "KRC_PRODUCT",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);