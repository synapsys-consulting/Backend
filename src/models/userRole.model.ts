import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class UserRole extends Model {
    public user_id!: number;
    public role_id!: number;
    public status_id!: string;
    public eff_date!: Date | null;
    public exp_date!: Date | null;
    public status_date!: Date | null;
    public user_create_id!: number;
    public user_modify_id!: number | null;
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
UserRole.init({
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull:false
    },
    role_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull:false
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
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_modify_id: {
        type: DataTypes.BIGINT
    },
},
{
    tableName: "KRR_USER_ROLE",
    sequelize,
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date'
    //deletedAt: 'status_date'
}
);