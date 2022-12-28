import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../services/database";

interface Topic
    extends Model<InferAttributes<Topic>, InferCreationAttributes<Topic>> {
    topic_id: string;
    user_id: string;
    agency_id: string;
    topic_url: string;
    description: string;
    last_update: Date;
}

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
