import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/database";

interface AppUser extends Model<InferAttributes<AppUser>, InferCreationAttributes<AppUser>> {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    agency_id: string;
}

export const AppUser = sequelize.define<AppUser>(
    "app_user",
    {
        // Model attributes are defined here
        user_id: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            primaryKey: true,
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
