import {
    DataTypes,
    InferAttributes,
    ModelDefined,
    Optional,
    Model,
    InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../services/database";

interface Agency extends Model<InferAttributes<Agency>, InferCreationAttributes<Agency>> {
    agency_id: string;
    short_name: string;
    long_name: string;
}

export const Agency = sequelize.define<Agency>(
    "agency",
    {
        // Model attributes are defined here
        agency_id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        short_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        long_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        // Other model options go here
        timestamps: false,
        tableName: "agency",
    }
);
