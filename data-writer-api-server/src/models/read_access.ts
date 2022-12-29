import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../services/database";

interface ReadAccess
    extends Model<
        InferAttributes<ReadAccess>,
        InferCreationAttributes<ReadAccess>
    > {
    user_id: string;
    topic_id: string;
    last_access: string;
}

export const ReadAccess = sequelize.define<ReadAccess>(
    "read_access",
    {
        // Model attributes are defined here
        user_id: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            primaryKey: true,
        },
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
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
