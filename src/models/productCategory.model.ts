import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db.model";
import { Product } from "./product.model";

export class ProductCategory extends Model {
    public product_category_id!: number;
    public product_category!: string;
    public remark!: number;
    public language_code!: string;
    public status_id!: string;
    public eff_date!: Date | null;
    public exp_date!: Date | null;
    public status_date!: Date;
    public user_create_id!: string;
    public user_modify_id!: number | null;
    public scenario!: string | null;
    public partner_id!: string;
    public partner_name!: string;

    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
ProductCategory.init (
{
    product_category_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    product_category: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    remark: {
        type: DataTypes.DECIMAL(20, 0),
        allowNull: false
    },
    language_code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status_id: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    eff_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    exp_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_create_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_modify_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    scenario: {
        type: DataTypes.STRING(10),
        allowNull: true
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
    tableName: "KRC_PRODUCT_CATEGORY",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);
