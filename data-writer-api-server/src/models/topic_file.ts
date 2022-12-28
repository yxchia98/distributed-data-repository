import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../services/database";

interface TopicFile
    extends Model<
        InferAttributes<TopicFile>,
        InferCreationAttributes<TopicFile>
    > {
    file_id: string;
    topic_id: string;
    agency_id: string;
    file_url: string;
    file_date: Date;
}

export const TopicFile = sequelize.define(
    "topic_file",
    {
        // Model attributes are defined here
        file_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        agency_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_date: {
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
