import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/database";

interface APIKey extends Model<InferAttributes<APIKey>, InferCreationAttributes<APIKey>> {
    key_id: string;
    user_id: string;
    topic_id: string;
    generated_date: string;
}

export const APIKey = sequelize.define<APIKey>(
    "api_key",
    {
        // Model attributes are defined here
        key_id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        generated_date: {
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
