import { DataTypes } from "sequelize";
import { sequelize } from "../services/database";

export const ReadAccess = sequelize.define(
    "read_access",
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
