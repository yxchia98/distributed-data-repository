import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../services/database";

interface WriteAccess
    extends Model<
        InferAttributes<WriteAccess>,
        InferCreationAttributes<WriteAccess>
    > {
    user_id: string;
    topic_id: string;
    last_access: string;
}

export const WriteAccess = sequelize.define(
    "write_access",
    {
        // Model attributes are defined here
        user_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        last_access: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        // Other model options go here
        timestamps: false,
    }
);
