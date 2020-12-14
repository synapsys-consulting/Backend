import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db.model';

export class Angel extends Model {
    public id!: string;
    public nombre!: string;
    //timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Angel.init (
{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50)
    }
},
{
    tableName: "ANGEL",
    sequelize,
    //timestamps: false
    //paranoid: true,
    createdAt: 'create_date',
    updatedAt: 'modify_date',
    //deletedAt: 'status_date'
}
);
