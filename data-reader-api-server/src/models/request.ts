import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/database";

interface AccessRequest
    extends Model<InferAttributes<AccessRequest>, InferCreationAttributes<AccessRequest>> {
    request_id: string;
    requestor_id: string;
    approver_id: string;
    topic_id: string;
    access_type: string;
    status: string;
    description: string;
}

export interface AccessRequestType {
    request_id?: string;
    requestor_id: string;
    approver_id: string;
    topic_id: string;
    access_type: string;
    status?: string;
    description: string;
}

export const AccessRequest = sequelize.define<AccessRequest>(
    "request",
    {
        // Model attributes are defined here
        request_id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        requestor_id: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        approver_id: {
            type: DataTypes.DECIMAL,
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
            defaultValue: "PENDING",
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
