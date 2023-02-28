import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/database";

interface Topic extends Model<InferAttributes<Topic>, InferCreationAttributes<Topic>> {
    topic_id: string;
    user_id: string;
    agency_id: string;
    topic_name: string;
    topic_url: string;
    description: string;
    last_update: string;
}

export const Topic = sequelize.define<Topic>(
    "topic",
    {
        // Model attributes are defined here
        topic_id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        agency_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        topic_name: {
            type: DataTypes.STRING,
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
