import { DataTypes } from "sequelize";
import { sequelize } from "../services/database";

export const Request = sequelize.define(
    "request",
    {
        // Model attributes are defined here
        request_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        requester_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        approver_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        access_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        // Other model options go here
        timestamps: false,
    }
);
