import { DataTypes } from "sequelize";
import { sequelize } from "../services/database";

export const Topic = sequelize.define(
    "topic",
    {
        // Model attributes are defined here
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        agency_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        topic_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        last_update: {
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
