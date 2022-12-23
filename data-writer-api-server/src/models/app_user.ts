import { DataTypes } from "sequelize";
import { sequelize } from "../services/database";

export const AppUser = sequelize.define(
    "app_user",
    {
        // Model attributes are defined here
        user_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        agency_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
    },
    {
        // Other model options go here
        timestamps: false,
    }
);
