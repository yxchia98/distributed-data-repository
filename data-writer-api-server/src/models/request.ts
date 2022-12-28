import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../services/database";

interface Request
    extends Model<InferAttributes<Request>, InferCreationAttributes<Request>> {
    request_id: string;
    requester_id: string;
    approver_id: string;
    topic_id: string;
    access_type: string;
    status: string;
    description: string;
}

export const Request = sequelize.define<Request>(
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
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        // Other model options go here
        timestamps: false,
    }
);
